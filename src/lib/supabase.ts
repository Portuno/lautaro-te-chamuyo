
import { supabase } from '../integrations/supabase/client';

// Simple wrapper types for the database operations
export interface BotSession {
  id: string;
  user_id: string;
  state: string;
  context: any;
  last_action?: string;
  error_message?: string;
  google_credentials?: any;
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
  status: string;
  created_at: string;
  updated_at: string;
}

export const supabaseClient = supabase;
