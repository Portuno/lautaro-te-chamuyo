import { supabase, isSupabaseReady } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase connection...');
  
  // Check environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const cleanedKey = supabaseAnonKey?.replace(/\s+/g, '');
  
  console.log('Environment variables:');
  console.log('- VITE_SUPABASE_URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET');
  console.log('- VITE_SUPABASE_ANON_KEY (raw):', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET');
  console.log('- VITE_SUPABASE_ANON_KEY (cleaned):', cleanedKey ? `${cleanedKey.substring(0, 20)}...` : 'NOT SET');
  console.log('- Raw key length:', supabaseAnonKey?.length || 0);
  console.log('- Cleaned key length:', cleanedKey?.length || 0);
  console.log('- Has line breaks:', supabaseAnonKey?.includes('\n') || supabaseAnonKey?.includes('\r'));
  console.log('- isSupabaseReady:', isSupabaseReady);
  
  if (!isSupabaseReady) {
    console.error('❌ Supabase is not configured properly');
    
    // Detailed debugging
    if (!supabaseUrl) {
      console.error('   - Missing VITE_SUPABASE_URL');
    } else if (!supabaseUrl.startsWith('https://')) {
      console.error('   - VITE_SUPABASE_URL must start with https://');
    }
    
    if (!supabaseAnonKey) {
      console.error('   - Missing VITE_SUPABASE_ANON_KEY');
    } else if (cleanedKey && cleanedKey.length <= 100) {
      console.error('   - VITE_SUPABASE_ANON_KEY seems too short (likely truncated)');
    }
    
    return {
      success: false,
      error: 'Supabase configuration missing or invalid',
      details: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
        keyLength: cleanedKey?.length || 0,
        hasLineBreaks: supabaseAnonKey?.includes('\n') || supabaseAnonKey?.includes('\r')
      }
    };
  }
  
  if (!supabase) {
    console.error('❌ Supabase client is null');
    return {
      success: false,
      error: 'Supabase client not initialized'
    };
  }
  
  try {
    // Test basic connection with a simple query
    console.log('🔄 Testing basic connection...');
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return {
        success: false,
        error: error.message,
        details: {
          errorCode: error.code,
          errorDetails: error.details,
          errorHint: error.hint
        }
      };
    }
    
    console.log('✅ Basic connection successful');
    console.log('📊 Query result:', data);
    
    // Test auth
    console.log('🔄 Testing auth session...');
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.warn('⚠️ Auth session error:', sessionError);
    } else {
      console.log('✅ Auth session check successful');
      console.log('👤 Current session:', session?.session ? 'Active session found' : 'No active session');
    }
    
    return {
      success: true,
      data: {
        profilesCount: data,
        hasSession: !!session?.session
      }
    };
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Test function that can be called from the console
if (typeof window !== 'undefined') {
  (window as any).testSupabase = testSupabaseConnection;
} 