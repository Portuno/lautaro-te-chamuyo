// Google Calendar REST API Service - Compatible con navegadores
export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  location?: string;
}

export interface ListEventsParams {
  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
  singleEvents?: boolean;
  orderBy?: 'startTime' | 'updated';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export class GoogleCalendarService {
  private accessToken: string | null = null;
  private readonly clientId: string;
  private readonly redirectUri: string;
  private readonly scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ].join(' ');

  constructor() {
    // Configuración OAuth2 - estos valores deben venir de variables de entorno
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-client-id';
    this.redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:8080/auth/callback';
  }

  /**
   * Autentica al usuario con Google usando OAuth2
   */
  async authenticate(): Promise<any> {
    try {
      // En desarrollo, retornamos datos mock
      if (import.meta.env.DEV) {
        console.log('🔑 Modo desarrollo - Usando autenticación simulada');
        this.accessToken = 'mock_access_token';
        return { 
          authenticated: true, 
          message: 'Autenticación simulada exitosa',
          mock: true 
        };
      }

      // En producción, generar URL de autenticación OAuth2
      const authUrl = this.generateAuthUrl();
      
      return { 
        authUrl, 
        message: 'Redirigir a Google para autenticar',
        authenticated: false 
      };
    } catch (error) {
      console.error('Error en autenticación:', error);
      throw new Error('Falló la autenticación con Google');
    }
  }

  /**
   * Genera URL de autenticación OAuth2
   */
  private generateAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Establece el token de acceso
   */
  setCredentials(tokens: AuthResponse | { access_token: string }) {
    this.accessToken = tokens.access_token;
  }

  /**
   * Lista eventos del calendario usando REST API
   */
  async listEvents(params: ListEventsParams = {}): Promise<CalendarEvent[]> {
    try {
      // En desarrollo, usar eventos mock
      if (import.meta.env.DEV || this.accessToken === 'mock_access_token') {
        return this.getMockEvents();
      }

      if (!this.accessToken) {
        throw new Error('No hay token de acceso. Debe autenticarse primero.');
      }

      const queryParams = new URLSearchParams({
        timeMin: params.timeMin || new Date().toISOString(),
        maxResults: (params.maxResults || 10).toString(),
        singleEvents: (params.singleEvents !== false).toString(),
        orderBy: params.orderBy || 'startTime'
      });

      if (params.timeMax) {
        queryParams.set('timeMax', params.timeMax);
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error listando eventos:', error);
      throw new Error('No se pudieron obtener los eventos');
    }
  }

  /**
   * Actualiza un evento existente usando REST API
   */
  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      // En desarrollo, simular actualización
      if (import.meta.env.DEV || this.accessToken === 'mock_access_token') {
        console.log('📝 Actualizando evento (mock):', eventId, updates);
        return { id: eventId, ...updates } as CalendarEvent;
      }

      if (!this.accessToken) {
        throw new Error('No hay token de acceso. Debe autenticarse primero.');
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error actualizando evento:', error);
      throw new Error('No se pudo actualizar el evento');
    }
  }

  /**
   * Crea un nuevo evento usando REST API
   */
  async createEvent(event: CalendarEvent): Promise<CalendarEvent> {
    try {
      // En desarrollo, simular creación
      if (import.meta.env.DEV || this.accessToken === 'mock_access_token') {
        console.log('✨ Creando evento (mock):', event);
        return { 
          id: `mock_${Date.now()}`, 
          ...event 
        };
      }

      if (!this.accessToken) {
        throw new Error('No hay token de acceso. Debe autenticarse primero.');
      }

      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error creando evento:', error);
      throw new Error('No se pudo crear el evento');
    }
  }

  /**
   * Elimina un evento usando REST API
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      // En desarrollo, simular eliminación
      if (import.meta.env.DEV || this.accessToken === 'mock_access_token') {
        console.log('🗑️ Eliminando evento (mock):', eventId);
        return;
      }

      if (!this.accessToken) {
        throw new Error('No hay token de acceso. Debe autenticarse primero.');
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error eliminando evento:', error);
      throw new Error('No se pudo eliminar el evento');
    }
  }

  /**
   * Eventos mock para desarrollo y testing
   */
  private getMockEvents(): CalendarEvent[] {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return [
      {
        id: 'mock_1',
        summary: 'Reunión de equipo',
        description: 'Reunión semanal del equipo de desarrollo',
        start: {
          dateTime: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires'
        },
        end: {
          dateTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires'
        },
        location: 'Sala de conferencias virtual',
        attendees: [
          { email: 'team@empresa.com', responseStatus: 'accepted' }
        ]
      },
      {
        id: 'mock_2',
        summary: 'Presentación del proyecto',
        description: 'Demostración del nuevo dashboard integrado',
        start: {
          dateTime: tomorrow.toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires'
        },
        end: {
          dateTime: new Date(tomorrow.getTime() + 90 * 60 * 1000).toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires'
        },
        location: 'Cliente - Oficina principal'
      },
      {
        id: 'mock_3',
        summary: 'Session de chamuyo',
        description: 'Práctica de habilidades conversacionales con Lautaro',
        start: {
          dateTime: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires'
        },
        end: {
          dateTime: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires'
        },
        location: 'Laboratorio de Chamuyo'
      }
    ];
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Cierra la sesión limpiando las credenciales
   */
  signOut(): void {
    this.accessToken = null;
  }
}

// Instancia singleton para usar en la aplicación
export const googleCalendarService = new GoogleCalendarService(); 