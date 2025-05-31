// Environment variables debug utility
// Use this to check your environment variables in the console

export const debugEnvVars = () => {
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_MABOT_USERNAME: import.meta.env.VITE_MABOT_USERNAME,
    VITE_MABOT_PASSWORD: import.meta.env.VITE_MABOT_PASSWORD,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  };

  console.group('🔍 Environment Variables Debug');
  
  Object.entries(envVars).forEach(([key, value]) => {
    const status = value ? '✅' : '❌';
    console.log(`${status} ${key}:`, value ? 
      (key.includes('KEY') || key.includes('PASSWORD') ? 
        `${value.substring(0, 10)}...` : value) 
      : 'NOT SET');
  });
  
  console.groupEnd();
  
  return envVars;
};

// Export individual getters for convenience
export const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL;
export const getSupabaseAnonKey = () => import.meta.env.VITE_SUPABASE_ANON_KEY;
export const getMabotUsername = () => import.meta.env.VITE_MABOT_USERNAME;
export const getMabotPassword = () => import.meta.env.VITE_MABOT_PASSWORD;
export const getApiBaseUrl = () => import.meta.env.VITE_API_BASE_URL;

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).debugEnvVars = debugEnvVars;
} 