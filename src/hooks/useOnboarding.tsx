import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useOnboarding = () => {
  const { isAuthenticated, profile, loading } = useAuth();
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    console.log('🔍 Onboarding check:', {
      loading,
      isAuthenticated,
      profile,
      onboarding_completed: profile?.onboarding_completed
    });

    // Only check for onboarding if user is authenticated and not loading
    if (!loading && isAuthenticated) {
      // Show onboarding if:
      // 1. User is authenticated
      // 2. Profile exists (to avoid showing onboarding before profile is loaded)
      // 3. Onboarding is not completed OR onboarding_completed field doesn't exist
      const needsOnboarding = profile && 
        (profile.onboarding_completed === false || profile.onboarding_completed === undefined || profile.onboarding_completed === null);
      
      console.log('✅ Needs onboarding:', needsOnboarding);
      setShouldShowOnboarding(!!needsOnboarding);
    } else {
      setShouldShowOnboarding(false);
    }
  }, [isAuthenticated, profile, loading]);

  const completeOnboarding = () => {
    console.log('🎉 Completing onboarding...');
    setShouldShowOnboarding(false);
  };

  return {
    shouldShowOnboarding,
    completeOnboarding,
    isOnboardingReady: !loading && isAuthenticated
  };
}; 