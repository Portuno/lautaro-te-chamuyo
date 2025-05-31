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
      // Verificar si ya existe una sesión para este usuario
      const { data: existingSession } = await supabaseClient
        .from('bot_sessions')
        .select('id')
        .eq('user_id', userId)
        .single();

      const sessionData = {
        user_id: userId,
        state,
        context,
        last_action: lastAction,
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      };

      if (existingSession) {
        // Actualizar sesión existente
        const { error } = await supabaseClient
          .from('bot_sessions')
          .update(sessionData)
          .eq('id', existingSession.id);

        if (error) throw error;
      } else {
        // Crear nueva sesión
        const { error } = await supabaseClient
          .from('bot_sessions')
          .insert(sessionData);

        if (error) throw error;
      }

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
      const { data, error } = await supabaseClient
        .from('bot_sessions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error loading bot session:', error);
        return null;
      }

      return data;
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
      const { error } = await supabaseClient
        .from('bot_sessions')
        .update({ 
          google_credentials: tokens,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

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
      const { data, error } = await supabaseClient
        .from('bot_sessions')
        .select('google_credentials')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error loading Google credentials:', error);
        return null;
      }

      return data?.google_credentials || null;
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
      // Cargar credenciales de Google
      const credentials = await this.loadGoogleCredentials(userId);
      if (credentials) {
        this.googleCalendarService.setCredentials(credentials);
      }

      // Obtener eventos de Google Calendar
      const googleEvents = await this.googleCalendarService.listEvents();

      // Convertir eventos de Google al formato de Supabase
      const supabaseEvents: Omit<SupabaseCalendarEvent, 'id' | 'created_at' | 'updated_at'>[] = googleEvents.map(event => ({
        user_id: userId,
        google_event_id: event.id,
        title: event.summary,
        description: event.description,
        start_time: event.start.dateTime || event.start.date || '',
        end_time: event.end.dateTime || event.end.date || '',
        location: event.location,
        all_day: !event.start.dateTime,
        status: 'confirmed'
      }));

      // Guardar eventos en Supabase (upsert)
      const { data, error } = await supabaseClient
        .from('calendar_events')
        .upsert(supabaseEvents, { 
          onConflict: 'user_id, google_event_id',
          ignoreDuplicates: false 
        })
        .select();

      if (error) throw error;

      return { success: true, events: data };
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
      const { data, error } = await supabaseClient
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return { success: true, events: data || [] };
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
      // Cargar credenciales de Google si están disponibles
      const credentials = await this.loadGoogleCredentials(userId);
      let googleEventId: string | undefined;

      if (credentials) {
        this.googleCalendarService.setCredentials(credentials);
        
        // Crear evento en Google Calendar
        const googleEvent = await this.googleCalendarService.createEvent(event);
        googleEventId = googleEvent.id;
      }

      // Crear evento en Supabase
      const supabaseEvent = {
        user_id: userId,
        google_event_id: googleEventId,
        title: event.summary,
        description: event.description,
        start_time: event.start.dateTime || event.start.date || '',
        end_time: event.end.dateTime || event.end.date || '',
        location: event.location,
        all_day: !event.start.dateTime,
        status: 'confirmed'
      };

      const { data, error } = await supabaseClient
        .from('calendar_events')
        .insert(supabaseEvent)
        .select()
        .single();

      if (error) throw error;

      return { success: true, event: data };
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
      // Obtener el evento existente
      const { data: existingEvent, error: fetchError } = await supabaseClient
        .from('calendar_events')
        .select('*')
        .eq('id', eventId)
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;
      if (!existingEvent) {
        return { success: false, error: 'Evento no encontrado' };
      }

      // Si hay credenciales de Google, actualizar también en Google Calendar
      const credentials = await this.loadGoogleCredentials(userId);
      if (credentials && existingEvent.google_event_id) {
        this.googleCalendarService.setCredentials(credentials);
        await this.googleCalendarService.updateEvent(existingEvent.google_event_id, updates);
      }

      // Actualizar en Supabase
      const supabaseUpdates = {
        title: updates.summary || existingEvent.title,
        description: updates.description || existingEvent.description,
        start_time: updates.start?.dateTime || updates.start?.date || existingEvent.start_time,
        end_time: updates.end?.dateTime || updates.end?.date || existingEvent.end_time,
        location: updates.location || existingEvent.location,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabaseClient
        .from('calendar_events')
        .update(supabaseUpdates)
        .eq('id', eventId)
        .eq('user_id', userId);

      if (error) throw error;

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
      // Obtener el evento existente
      const { data: existingEvent, error: fetchError } = await supabaseClient
        .from('calendar_events')
        .select('*')
        .eq('id', eventId)
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;
      if (!existingEvent) {
        return { success: false, error: 'Evento no encontrado' };
      }

      // Si hay credenciales de Google, eliminar también de Google Calendar
      const credentials = await this.loadGoogleCredentials(userId);
      if (credentials && existingEvent.google_event_id) {
        this.googleCalendarService.setCredentials(credentials);
        await this.googleCalendarService.deleteEvent(existingEvent.google_event_id);
      }

      // Eliminar de Supabase
      const { error } = await supabaseClient
        .from('calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }
}

// Instancia singleton
export const supabaseLaubotService = new SupabaseLaubotService(); 