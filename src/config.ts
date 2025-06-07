// Secure API Configuration with Environment Variables
const isDevelopment = import.meta.env.DEV;
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Enhanced environment detection
const isActualDevelopment = isDevelopment || isLocalhost;

// Security warning for missing configuration
if (!import.meta.env.VITE_API_BASE_URL) {
  if (isActualDevelopment) {
    console.warn('⚠️ SECURITY WARNING: Using default API URL in development mode');
  } else {
    console.error('🚨 CRITICAL: VITE_API_BASE_URL environment variable missing in production');
    console.error('📋 Fix: Configure VITE_API_BASE_URL in Vercel Environment Variables');
  }
}

// Use environment variable or fallback (with warnings)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (() => {
    const fallbackUrl = 'https://back.mapeima.space:8443';
    
    if (!isActualDevelopment) {
      console.error('🔒 SECURITY NOTICE: Using fallback API URL in production - configure VITE_API_BASE_URL');
    }
    
    return fallbackUrl;
  })();

// Additional security configurations
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  maxRetries: 3,
  isDevelopment: isActualDevelopment,
  isConfigured: !!import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

// Validation function to ensure configuration is secure
export const validateConfig = () => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }
  
  // Warning for localhost in production
  if (!isActualDevelopment && API_BASE_URL.includes('localhost')) {
    console.warn('⚠️ WARNING: Production is using localhost URLs');
  }
  
  // Log configuration status
  if (!isActualDevelopment && !import.meta.env.VITE_API_BASE_URL) {
    console.warn('🔧 PRODUCTION SETUP NEEDED: Configure VITE_API_BASE_URL environment variable');
  }
  
  return true;
};

// Validate configuration on module load
validateConfig(); 