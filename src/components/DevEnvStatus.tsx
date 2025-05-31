import React, { useState } from 'react';
import { debugEnvVars } from '../utils/env-debug';
import { testSupabaseConnection } from '../utils/test-supabase';

interface DevEnvStatusProps {
  className?: string;
}

const DevEnvStatus: React.FC<DevEnvStatusProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<string | null>(null);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_MABOT_USERNAME: import.meta.env.VITE_MABOT_USERNAME,
    VITE_MABOT_PASSWORD: import.meta.env.VITE_MABOT_PASSWORD,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      debugEnvVars();
    }
  };

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    setSupabaseTestResult(null);
    
    try {
      const result = await testSupabaseConnection();
      setSupabaseTestResult(result.success ? '✅ Connection successful' : `❌ ${result.error}`);
    } catch (error) {
      setSupabaseTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const missingVars = Object.entries(envVars).filter(([, value]) => !value);
  const hasIssues = missingVars.length > 0;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors ${
          hasIssues 
            ? 'bg-red-100 text-red-800 border border-red-300' 
            : 'bg-green-100 text-green-800 border border-green-300'
        } hover:opacity-80`}
        aria-label="Environment Variables Status"
      >
        <span className="text-xs">
          {hasIssues ? '⚠️' : '✅'}
        </span>
        <span>ENV ({Object.keys(envVars).length - missingVars.length}/{Object.keys(envVars).length})</span>
      </button>

      {isExpanded && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-xl p-4 min-w-80 max-w-96">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Environment Variables</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-xs">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-mono text-gray-600">{key}:</span>
                <span className={`${value ? 'text-green-600' : 'text-red-600'}`}>
                  {value ? (
                    key.includes('KEY') || key.includes('PASSWORD') ? 
                      `${String(value).substring(0, 10)}...` : 
                      String(value).length > 30 ? 
                        `${String(value).substring(0, 30)}...` : 
                        String(value)
                  ) : (
                    'NOT SET'
                  )}
                </span>
              </div>
            ))}
          </div>
          
          {missingVars.length > 0 && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              <strong>Missing:</strong> {missingVars.map(([key]) => key).join(', ')}
            </div>
          )}
          
          <div className="mt-3 space-y-2">
            <button
              onClick={() => debugEnvVars()}
              className="w-full px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors"
            >
              Log to Console
            </button>
            
            <button
              onClick={handleTestSupabase}
              disabled={isTestingSupabase}
              className="w-full px-3 py-1 bg-purple-100 text-purple-800 rounded text-xs hover:bg-purple-200 transition-colors disabled:opacity-50"
            >
              {isTestingSupabase ? 'Testing Supabase...' : 'Test Supabase Connection'}
            </button>
          </div>
          
          {supabaseTestResult && (
            <div className={`mt-2 p-2 rounded text-xs ${
              supabaseTestResult.includes('✅') 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {supabaseTestResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DevEnvStatus; 