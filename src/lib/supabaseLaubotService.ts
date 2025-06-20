import { supabaseClient, type BotSession, type CalendarEvent as SupabaseCalendarEvent } from './supabase';
import { GoogleCalendarService, type CalendarEvent } from './googleCalendarService';

export class SupabaseLaubotService {
  private googleCalendarService: GoogleCalendarService;

  constructor() {
    this.googleCalendarService = new GoogleCalendarService();
  }

  /**
   * Guarda el estado del bot en Supabase
   */
  async saveBotSession(userId: string, state: string, context: any, lastAction?: string, errorMessage?: string) {
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    try {
      console.log('Note: Bot sessions table not yet created. This is a placeholder implementation.');
      return { success: true };
    } catch (error) {
      console.error('Error saving bot session:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }

  /**
   * Carga el estado del bot desde Supabase
   */
  async loadBotSession(userId: string): Promise<BotSession | null> {
    if (!userId) {
      return null;
    }

    try {
      console.log('Note: Bot sessions table not yet created. This is a placeholder implementation.');
      return null;
    } catch (error) {
      console.error('Error loading bot session:', error);
      return null;
    }
  }

  /**
   * Guarda credenciales de Google de forma segura
   */
  async saveGoogleCredentials(userId: string, tokens: any) {
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    try {
      console.log('Note: Bot sessions table not yet created. This is a placeholder implementation.');
      return { success: true };
    } catch (error) {
      console.error('Error saving Google credentials:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }

  /**
   * Carga credenciales de Google
   */
  async loadGoogleCredentials(userId: string): Promise<any | null> {
    if (!userId) {
      return null;
    }

    try {
      console.log('Note: Bot sessions table not yet created. This is a placeholder implementation.');
      return null;
    } catch (error) {
      console.error('Error loading Google credentials:', error);
      return null;
    }
  }

  /**
   * Sincroniza eventos de Google Calendar con Supabase
   */
  async syncCalendarEvents(userId: string): Promise<{ success: boolean; error?: string; events?: SupabaseCalendarEvent[] }> {
    if (!userId) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      console.log('Note: Calendar events table not yet created. This is a placeholder implementation.');
      return { success: true, events: [] };
    } catch (error) {
      console.error('Error syncing calendar events:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }

  /**
   * Obtiene eventos del calendario desde Supabase
   */
  async getCalendarEvents(userId: string, limit: number = 10): Promise<{ success: boolean; error?: string; events?: SupabaseCalendarEvent[] }> {
    if (!userId) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      console.log('Note: Calendar events table not yet created. This is a placeholder implementation.');
      return { success: true, events: [] };
    } catch (error) {
      console.error('Error getting calendar events:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }

  /**
   * Crea un nuevo evento en el calendario
   */
  async createCalendarEvent(userId: string, event: CalendarEvent): Promise<{ success: boolean; error?: string; event?: SupabaseCalendarEvent }> {
    if (!userId) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      console.log('Note: Calendar events table not yet created. This is a placeholder implementation.');
      return { success: true };
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }

  /**
   * Actualiza un evento del calendario
   */
  async updateCalendarEvent(userId: string, eventId: string, updates: Partial<CalendarEvent>): Promise<{ success: boolean; error?: string }> {
    if (!userId) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      console.log('Note: Calendar events table not yet created. This is a placeholder implementation.');
      return { success: true };
    } catch (error) {
      console.error('Error updating calendar event:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }

  /**
   * Elimina un evento del calendario
   */
  async deleteCalendarEvent(userId: string, eventId: string): Promise<{ success: boolean; error?: string }> {
    if (!userId) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      console.log('Note: Calendar events table not yet created. This is a placeholder implementation.');
      return { success: true };
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }

  /**
   * CHATS Y MENSAJES (multi-chat)
   */

  // Listar los chats del usuario (máx 3)
  async getUserChats(userId: string) {
    const { data, error } = await supabaseClient
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  }

  // Crear un nuevo chat
  async createChat(userId: string, name: string) {
    const { data, error } = await supabaseClient
      .from('chats')
      .insert([{ user_id: userId, name }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Renombrar un chat
  async renameChat(chatId: string, name: string) {
    const { data, error } = await supabaseClient
      .from('chats')
      .update({ name })
      .eq('id', chatId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Borrar un chat
  async deleteChat(chatId: string) {
    const { error } = await supabaseClient
      .from('chats')
      .delete()
      .eq('id', chatId);
    if (error) throw error;
    return true;
  }

  // Listar mensajes de un chat
  async getChatMessages(chatId: string) {
    const { data, error } = await supabaseClient
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  }

  // Agregar mensaje a un chat
  async addMessage(chatId: string, sender: string, content: string) {
    const { data, error } = await supabaseClient
      .from('messages')
      .insert([{ chat_id: chatId, sender, content }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// Instancia singleton
export const supabaseLaubotService = new SupabaseLaubotService();
