
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
  subscription_status: string;
  chamuyo_level: number;
  total_points: number;
  onboarding_completed?: boolean;
  preferred_name?: string;
  interaction_style?: string;
  interests?: string[];
  lautaro_mood?: string;
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
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

// Create context with default value
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isAuthenticated: false
  });

  // Debug logging for loading state changes
  useEffect(() => {
    console.log('🔄 Auth state changed:', {
      loading: authState.loading,
      isAuthenticated: authState.isAuthenticated,
      hasUser: !!authState.user,
      hasProfile: !!authState.profile
    });
  }, [authState.loading, authState.isAuthenticated, authState.user, authState.profile]);

  // Función para cargar o crear el perfil del usuario
  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('🔍 Loading profile for user:', userId);
      
      // Intentar cargar el perfil existente
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Perfil no existe, intentar crearlo automáticamente
        console.log('📝 Profile not found, creating new profile for user:', userId);
        
        // Obtener datos del usuario de auth.users
        const { data: authUser } = await supabase.auth.getUser();
        
        const newProfile = {
          user_id: userId,
          full_name: authUser?.user?.user_metadata?.full_name || authUser?.user?.email || 'Usuario',
          chamuyo_level: 1,
          total_points: 0,
          subscription_status: 'free',
          onboarding_completed: false
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.log('❌ Error creating profile:', createError);
          return null;
        }

        console.log('✅ Profile created successfully:', createdProfile);
        return createdProfile as UserProfile;
      } else if (error) {
        console.log('❌ Error loading profile:', error);
        return null;
      }

      console.log('✅ Profile loaded successfully');
      return data as UserProfile;
    } catch (error) {
      console.log('❌ Exception loading/creating profile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check initial session
    const checkInitialSession = async () => {
      try {
        console.log('🔍 Starting initial session check...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.log('❌ Session check error:', error);
          setAuthState(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Error al verificar sesión: ' + error.message 
          }));
          return;
        }

        if (session?.user) {
          console.log('✅ Session found, loading profile...');
          // Cargar el perfil del usuario
          const profile = await loadUserProfile(session.user.id);
          console.log('✅ Profile loaded, updating state...');
          setAuthState({
            user: session.user,
            profile,
            loading: false,
            isAuthenticated: true
          });
        } else {
          console.log('❌ No session found, setting loading to false');
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        if (!mounted) return;
        console.log('❌ Error in session check:', error);
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Error de conexión con el servidor'
        }));
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔄 Auth state change event:', event, session?.user?.id);

        if (session?.user) {
          // Cargar el perfil del usuario cuando se autentica
          const profile = await loadUserProfile(session.user.id);
          setAuthState({
            user: session.user,
            profile,
            loading: false,
            isAuthenticated: true
          });
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

    checkInitialSession();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Starting signIn process...', { email });
      setAuthState(prev => ({ ...prev, loading: true, error: undefined }));

      console.log('📡 Making request to Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('🔑 SignIn response:', {
        hasData: !!data,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        error: error?.message,
        errorName: error?.name,
        errorStatus: error?.status
      });

      if (error) {
        console.log('❌ SignIn error details:', {
          message: error.message,
          name: error.name,
          status: error.status,
          details: error
        });
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: error.message };
      }

      console.log('✅ SignIn successful, setting loading to false');
      // Reset loading state on success - the auth state change listener will handle the rest
      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: true };
    } catch (error) {
      console.log('❌ SignIn catch error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack'
      });
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

  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: undefined }));

      // Mejorar la detección del entorno y URL de redirección
      const currentUrl = window.location.origin;
      const isLocalDev = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1');
      
      // Para desarrollo local, usar una URL específica
      // Para producción, usar la URL actual
      const redirectUrl = isLocalDev 
        ? `${currentUrl}/` 
        : `${currentUrl}/`;
      
      console.log('🔗 Google OAuth configuration:', {
        currentUrl,
        isLocalDev,
        redirectUrl,
        environment: isLocalDev ? 'Development' : 'Production'
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.log('❌ Google OAuth error:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: error.message };
      }

      console.log('✅ Google OAuth initiated successfully');
      // OAuth redirect will handle the rest, don't set loading to false here
      return { success: true };
    } catch (error) {
      console.log('❌ Google OAuth exception:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
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

      // Actualizar el estado local
      setAuthState(prev => ({
        ...prev,
        profile: data as UserProfile
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

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    resetPassword,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
