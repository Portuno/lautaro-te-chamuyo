
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  subscription_status: 'free' | 'premium';
  chamuyo_level: number;
  total_points: number;
  onboarding_completed?: boolean;
  preferred_name?: string;
  interaction_style?: 'confianza' | 'calma' | 'sorpresa';
  interests?: string[];
  lautaro_mood?: 'amable' | 'picaro' | 'romantico' | 'poetico' | 'misterioso';
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  error?: string;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    // Verificar sesión inicial
    checkInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setAuthState({
            user: null,
            profile: null,
            loading: false,
            isAuthenticated: false
          });
        }
      }
    );

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  const checkInitialSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Error al verificar sesión: ' + error.message 
        }));
        return;
      }

      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error de conexión con el servidor'
      }));
    }
  };

  const loadUserProfile = async (user: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.message && !error.message.includes('No rows')) {
        console.error('Error loading profile:', error);
      }

      setAuthState({
        user,
        profile: profile || null,
        loading: false,
        isAuthenticated: true
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setAuthState({
        user,
        profile: null,
        loading: false,
        isAuthenticated: true
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: undefined }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: undefined }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: error.message };
      }

      // Crear perfil de usuario con onboarding_completed = false
      if (data.user) {
        try {
          const insertResult = await supabase
            .from('user_profiles')
            .insert({
              user_id: data.user.id,
              full_name: fullName,
              subscription_status: 'free',
              chamuyo_level: 1,
              total_points: 0,
              onboarding_completed: false
            });

          if (insertResult && 'error' in insertResult && insertResult.error) {
            console.error('Error creating profile:', insertResult.error);
          }
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        profile: null,
        loading: false,
        isAuthenticated: false
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', authState.user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setAuthState(prev => ({ 
        ...prev, 
        profile: data || prev.profile 
      }));

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: undefined }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signUp,
        signOut,
        updateProfile,
        resetPassword,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
