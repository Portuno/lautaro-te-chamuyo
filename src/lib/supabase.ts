import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.replace(/\s+/g, ''); // Remove all whitespace and newlines

// Debug logging in development
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Config Debug:', {
    url: supabaseUrl ? `${supabaseUrl.slice(0, 30)}...` : 'undefined',
    urlLength: supabaseUrl?.length || 0,
    urlStartsWithHttps: supabaseUrl?.startsWith('https://'),
    keyLength: supabaseAnonKey?.length || 0,
    keyOver100: (supabaseAnonKey?.length || 0) > 100
  });
}

// Verificar si las variables están configuradas
const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your-supabase-url' && 
  supabaseAnonKey !== 'your-anon-key' &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 100
);

// Debug result
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Ready:', isSupabaseConfigured);
}

// Cliente de Supabase (solo si está configurado)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Mock client para desarrollo sin Supabase
const createMockSupabaseClient = () => {
  const mockError = new Error('Supabase no configurado - usando mock');
  const mockResponse = { data: null, error: mockError };
  
  const createMockQueryBuilder = (): any => {
    const builder = {
      select: () => builder,
      insert: () => builder,
      update: () => builder,
      delete: () => builder,
      eq: () => builder,
      order: () => builder,
      limit: () => builder,
      upsert: () => builder,
      single: async () => mockResponse,
      then: (resolve: any) => Promise.resolve(mockResponse).then(resolve),
      catch: (reject: any) => Promise.resolve(mockResponse).catch(reject),
      finally: (fn: any) => Promise.resolve(mockResponse).finally(fn)
    };
    return builder;
  };

  return {
    auth: {
      signUp: async () => ({ data: null, error: mockError }),
      signInWithPassword: async () => ({ data: null, error: mockError }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: mockError }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => createMockQueryBuilder()
  };
};

// Exportar cliente real o mock
export const supabaseClient = supabase || createMockSupabaseClient();

// Flag para saber si Supabase está configurado
export const isSupabaseReady = isSupabaseConfigured;

// Tipos de base de datos
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_status?: 'free' | 'premium';
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  subscription_status: 'free' | 'premium';
  chamuyo_level: number;
  total_points: number;
  
  // Onboarding preferences
  onboarding_completed?: boolean;
  preferred_name?: string;
  interaction_style?: 'confianza' | 'calma' | 'sorpresa';
  interests?: string[]; // Array of selected interests
  lautaro_mood?: 'amable' | 'picaro' | 'romantico' | 'poetico' | 'misterioso';
  
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  google_event_id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  all_day: boolean;
  status: 'confirmed' | 'tentative' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface BotSession {
  id: string;
  user_id: string;
  state: 'idle' | 'authenticating' | 'authenticated' | 'listing_events' | 'updating_event' | 'creating_event' | 'error';
  context: any; // JSON con el contexto del bot
  last_action?: string;
  error_message?: string;
  google_credentials?: any; // JSON con tokens de Google
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  conversation_id: string;
  content: string;
  role: 'user' | 'assistant';
  style?: 'amable' | 'formal' | 'divertido' | 'tierno';
  chamuyo_intensity?: number;
  metadata?: any; // JSON con metadata adicional
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title?: string;
  last_message_at: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

// Tipos para las tablas de database
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>;
      };
      calendar_events: {
        Row: CalendarEvent;
        Insert: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CalendarEvent, 'id' | 'user_id' | 'created_at'>>;
      };
      bot_sessions: {
        Row: BotSession;
        Insert: Omit<BotSession, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BotSession, 'id' | 'user_id' | 'created_at'>>;
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: Omit<ChatMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<ChatMessage, 'id' | 'user_id' | 'created_at'>>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Conversation, 'id' | 'user_id' | 'created_at'>>;
      };
    };
  };
} 