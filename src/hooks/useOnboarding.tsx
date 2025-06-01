
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useOnboarding = () => {
  const { isAuthenticated, profile, loading } = useAuth();
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    console.log('🔍 Checking onboarding status:', { 
      loading, 
      isAuthenticated, 
      profile,
      onboarding_completed: profile?.onboarding_completed 
    });

    // Solo verificar onboarding si el usuario está autenticado y no está cargando
    if (!loading && isAuthenticated) {
      // Mostrar onboarding si:
      // 1. Usuario está autenticado
      // 2. El perfil existe (para evitar mostrar onboarding antes de que se cargue el perfil)
      // 3. El onboarding no está completado
      const needsOnboarding = profile && 
        (profile.onboarding_completed === false || profile.onboarding_completed === undefined || profile.onboarding_completed === null);
      
      console.log('📋 Needs onboarding:', needsOnboarding);
      setShouldShowOnboarding(!!needsOnboarding);
    } else {
      setShouldShowOnboarding(false);
    }
  }, [isAuthenticated, profile, loading]);

  const completeOnboarding = () => {
    console.log('✅ Completing onboarding');
    setShouldShowOnboarding(false);
  };

  return {
    shouldShowOnboarding,
    completeOnboarding,
    isOnboardingReady: !loading && isAuthenticated
  };
};
