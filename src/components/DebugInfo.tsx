import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseReady } from '../lib/supabase';

const DebugInfo: React.FC = () => {
  console.log('🔍 DebugInfo component rendering...');
  
  const { isAuthenticated, user, profile, loading } = useAuth();

  // Always render for debugging
  const shouldRender = true;

  if (!shouldRender) {
    return null;
  }

  // Debug Supabase configuration
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.replace(/\s+/g, '');

  console.log('🔍 DebugInfo - Environment vars:', {
    supabaseUrl,
    supabaseKeyLength: supabaseAnonKey?.length,
    isSupabaseReady
  });

  const debugSupabase = {
    url: supabaseUrl,
    urlLength: supabaseUrl?.length || 0,
    urlStartsWithHttps: supabaseUrl?.startsWith('https://'),
    keyLength: supabaseAnonKey?.length || 0,
    keyOver100: (supabaseAnonKey?.length || 0) > 100,
    isSupabaseReady,
    urlPreview: supabaseUrl ? supabaseUrl.slice(0, 30) + '...' : 'undefined',
    keyPreview: supabaseAnonKey ? supabaseAnonKey.slice(0, 20) + '...' : 'undefined'
  };

  return (
    <div className="fixed top-4 left-4 bg-red-600 text-white p-3 rounded-lg text-xs z-[9999] max-w-sm overflow-y-auto max-h-96 border-4 border-yellow-400">
      <div className="font-bold mb-2 text-yellow-300">🐛 DEBUG INFO - VISIBLE?</div>
      
      {/* Environment Check */}
      <div className="mb-3">
        <div className="font-semibold text-yellow-300">Environment:</div>
        <div>DEV: {import.meta.env.DEV ? '✅' : '❌'}</div>
        <div>PROD: {import.meta.env.PROD ? '✅' : '❌'}</div>
      </div>

      {/* Supabase Config */}
      <div className="mb-3">
        <div className="font-semibold text-yellow-300">Supabase:</div>
        <div>Ready: {debugSupabase.isSupabaseReady ? '✅' : '❌'}</div>
        <div className="text-green-300">URL ({debugSupabase.urlLength} chars):</div>
        <div className="text-white break-all text-[10px]">{debugSupabase.urlPreview}</div>
        <div>HTTPS: {debugSupabase.urlStartsWithHttps ? '✅' : '❌'}</div>
        <div className="text-green-300">Key ({debugSupabase.keyLength} chars):</div>
        <div className="text-white break-all text-[10px]">{debugSupabase.keyPreview}</div>
        <div>Key &gt;100: {debugSupabase.keyOver100 ? '✅' : '❌'}</div>
        
        {/* Specific validation checks */}
        <div className="mt-2 text-red-300">
          {!debugSupabase.url && <div>❌ URL missing</div>}
          {!debugSupabase.urlStartsWithHttps && <div>❌ URL no HTTPS</div>}
          {debugSupabase.keyLength === 0 && <div>❌ Key missing</div>}
          {!debugSupabase.keyOver100 && debugSupabase.keyLength > 0 && <div>❌ Key too short</div>}
        </div>
      </div>

      {/* Auth State */}
      <div className="mb-3">
        <div className="font-semibold text-yellow-300">Auth:</div>
        <div>Loading: {loading ? '✅' : '❌'}</div>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>User: {user?.email || 'None'}</div>
      </div>
      
      <div className="text-gray-300">
        Screen: {window.innerWidth}px
      </div>
    </div>
  );
};

export default DebugInfo; 