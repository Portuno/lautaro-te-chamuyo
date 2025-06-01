import React, { useState } from 'react';
import { Settings, Database, Eye, EyeOff, TestTube2, Zap } from 'lucide-react';
import { testSupabaseConnection } from '../utils/test-supabase';
import { useAuth } from '../hooks/useAuth';

const DevEnvStatus = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const { updateProfile, profile } = useAuth();

  // Solo mostrar en desarrollo
  if (import.meta.env.PROD) {
    return null;
  }

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
      console.log('Test result:', result);
    } catch (error) {
      setTestResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const handleResetOnboarding = async () => {
    if (profile) {
      try {
        await updateProfile({ onboarding_completed: false });
        console.log('🔄 Onboarding reset - refresh page to see onboarding');
        alert('Onboarding reseteado. Refresca la página para verlo.');
      } catch (error) {
        console.error('Error resetting onboarding:', error);
        alert('Error reseteando onboarding. Ver consola.');
      }
    }
  };

  const envVars = [
    { key: 'VITE_SUPABASE_URL', value: import.meta.env.VITE_SUPABASE_URL },
    { key: 'VITE_SUPABASE_ANON_KEY', value: import.meta.env.VITE_SUPABASE_ANON_KEY },
    { key: 'VITE_API_BASE_URL', value: import.meta.env.VITE_API_BASE_URL },
    { key: 'VITE_MABOT_USERNAME', value: import.meta.env.VITE_MABOT_USERNAME },
    { key: 'VITE_MABOT_PASSWORD', value: import.meta.env.VITE_MABOT_PASSWORD },
  ];

  const isSupabaseConfigured = envVars[0].value && envVars[1].value && 
    envVars[0].value !== 'your-supabase-url' && 
    envVars[1].value !== 'your-anon-key';

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
          isSupabaseConfigured 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-red-500 hover:bg-red-600'
        } text-white`}
        title={isSupabaseConfigured ? 'ENV configurado correctamente' : 'ENV no configurado'}
      >
        <Settings className="w-5 h-5" />
      </button>

      {isVisible && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Dev Environment</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>

          {/* Status general */}
          <div className="mb-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isSupabaseConfigured ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              <Database className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isSupabaseConfigured ? 'Supabase OK' : 'Supabase no configurado'}
              </span>
            </div>
          </div>

          {/* Test buttons */}
          <div className="space-y-2 mb-4">
            <button
              onClick={handleTestSupabase}
              disabled={isTestingSupabase || !isSupabaseConfigured}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <TestTube2 className="w-4 h-4" />
              {isTestingSupabase ? 'Testing...' : 'Test Supabase Connection'}
            </button>

            {profile && (
              <button
                onClick={handleResetOnboarding}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
              >
                <Zap className="w-4 h-4" />
                Reset Onboarding
              </button>
            )}
          </div>

          {/* Test result */}
          {testResult && (
            <div className="mb-4">
              <div className={`p-3 rounded-lg text-sm ${
                testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <div className="font-medium mb-1">
                  {testResult.success ? '✅ Conexión exitosa' : '❌ Error de conexión'}
                </div>
                {testResult.error && (
                  <div className="text-xs opacity-75">{testResult.error}</div>
                )}
              </div>
            </div>
          )}

          {/* Variables de entorno */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Environment Variables:</h4>
            {envVars.map((env) => (
              <div key={env.key} className="text-xs">
                <div className="font-mono font-medium text-gray-600">{env.key}</div>
                <div className={`font-mono p-1 rounded truncate ${
                  env.value && env.value !== 'undefined' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {env.value || 'undefined'}
                </div>
              </div>
            ))}
          </div>

          {/* Profile info */}
          {profile && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">User Profile:</h4>
              <div className="text-xs space-y-1">
                <div>Onboarding: {profile.onboarding_completed ? '✅ Completed' : '❌ Pending'}</div>
                <div>Preferred Name: {profile.preferred_name || 'None'}</div>
                <div>Interaction Style: {profile.interaction_style || 'None'}</div>
                <div>Mood: {profile.lautaro_mood || 'None'}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DevEnvStatus; 