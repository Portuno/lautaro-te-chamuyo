
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DevEnvStatus: React.FC = () => {
  try {
    const { isAuthenticated, user, profile } = useAuth();
    
    // Solo mostrar en desarrollo
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }

    return (
      <div className="fixed top-0 left-0 bg-red-500 text-white text-xs p-1 z-50">
        Dev: {isAuthenticated ? `✅ ${user?.email}` : '❌ No auth'} | 
        Profile: {profile ? '✅' : '❌'} | 
        Onboarding: {profile?.onboarding_completed ? '✅' : '❌'}
      </div>
    );
  } catch (error) {
    // Si no está dentro del AuthProvider, no mostrar nada
    if (error instanceof Error && error.message.includes('useAuth must be used within an AuthProvider')) {
      return null;
    }
    
    // Para otros errores, mostrar en consola pero no fallar
    console.error('DevEnvStatus error:', error);
    return null;
  }
};

export default DevEnvStatus;
