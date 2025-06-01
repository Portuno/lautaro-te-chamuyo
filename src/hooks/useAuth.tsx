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
    loading: false,
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

  // Función para cargar el perfil del usuario
  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Handle OAuth redirect
    const handleOAuthRedirect = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');
      
      if (access_token && refresh_token) {
        console.log('🔄 OAuth redirect detected, processing tokens...');
        
        try {
          // Set the session manually using the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });
          
          if (error) {
            console.error('❌ Error setting session:', error);
            setAuthState(prev => ({ 
              ...prev, 
              loading: false, 
              error: 'Error procesando autenticación OAuth' 
            }));
          } else if (data.session?.user) {
            console.log('✅ OAuth session established successfully');
            // Load user profile
            const profile = await loadUserProfile(data.session.user.id);
            setAuthState({
              user: data.session.user,
              profile,
              loading: false,
              isAuthenticated: true
            });
          }
        } catch (error) {
          console.error('❌ OAuth processing error:', error);
          setAuthState(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Error procesando autenticación OAuth' 
          }));
        }
        
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return true; // Indicate that OAuth was processed
      }
      
      return false; // No OAuth tokens found
    };

    // Check initial session
    const checkInitialSession = async () => {
      try {
        // Handle OAuth redirect first
        const oauthProcessed = await handleOAuthRedirect();
        
        if (oauthProcessed) return;
        
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
      setAuthState(prev => ({ ...prev, loading: true, error: undefined }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: error.message };
      }

      // Reset loading state on success - the auth state change listener will handle the rest
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

      // Use the correct development server port
      const redirectUrl = 'http://localhost:8080/';
      console.log('🔗 Google OAuth redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: error.message };
      }

      // OAuth redirect will handle the rest
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
