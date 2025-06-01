// Secure API Configuration with Environment Variables
const isDevelopment = import.meta.env.DEV;

// Security warning for development mode
if (isDevelopment && !import.meta.env.VITE_API_BASE_URL) {
  console.warn('⚠️ SECURITY WARNING: Using default API URL in development mode');
}

// Use environment variable or fallback to default (only for development)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isDevelopment 
    ? 'https://back.mapeima.space:8443' 
    : (() => {
        throw new Error('VITE_API_BASE_URL environment variable is required in production');
      })()
  );

// Additional security configurations
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  maxRetries: 3,
  isDevelopment,
} as const;

// Validation function to ensure configuration is secure
export const validateConfig = () => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }
  
  if (!isDevelopment && API_BASE_URL.includes('localhost')) {
    throw new Error('Production should not use localhost URLs');
  }
  
  return true;
};

// Validate configuration on module load
validateConfig(); 