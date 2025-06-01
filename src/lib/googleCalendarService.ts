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
    // Secure OAuth2 Configuration with proper validation
    this.clientId = this.validateAndGetClientId();
    this.redirectUri = this.validateAndGetRedirectUri();
    
    // Security warning for development
    if (import.meta.env.DEV) {
      this.logSecurityWarnings();
    }
  }

  /**
   * Validates and retrieves Google Client ID with proper security checks
   */
  private validateAndGetClientId(): string {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      const fallbackId = 'development-mock-client-id';
      
      if (import.meta.env.DEV) {
        console.warn('⚠️ SECURITY WARNING: VITE_GOOGLE_CLIENT_ID not configured - using mock mode');
      } else {
        console.error('🚨 CRITICAL: VITE_GOOGLE_CLIENT_ID missing in production - Google Calendar disabled');
        console.error('📋 Fix: Configure VITE_GOOGLE_CLIENT_ID in Vercel Environment Variables');
      }
      
      return fallbackId;
    }
    
    if (clientId === 'your-client-id') {
      console.error('🔒 SECURITY ERROR: Default client ID detected - update VITE_GOOGLE_CLIENT_ID');
      return 'development-mock-client-id';
    }
    
    // Validate client ID format (Google client IDs end with .googleusercontent.com)
    if (!import.meta.env.DEV && !clientId.includes('.googleusercontent.com')) {
      console.warn('⚠️ WARNING: Client ID format may be invalid');
    }
    
    return clientId;
  }

  /**
   * Validates and retrieves redirect URI with security checks
   */
  private validateAndGetRedirectUri(): string {
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const fallbackUri = import.meta.env.DEV ? 'http://localhost:8080/auth/callback' : 'https://placeholder-oauth-redirect.com/callback';
    
    if (!redirectUri) {
      if (!import.meta.env.DEV) {
        console.error('🚨 CRITICAL: VITE_GOOGLE_REDIRECT_URI missing in production');
        console.error('📋 Fix: Configure VITE_GOOGLE_REDIRECT_URI in Vercel Environment Variables');
      }
      return fallbackUri;
    }
    
    // Security check: production should use HTTPS
    if (!import.meta.env.DEV && !redirectUri.startsWith('https://')) {
      console.error('🔒 SECURITY ERROR: Production redirect URI must use HTTPS - using fallback');
      return fallbackUri;
    }
    
    return redirectUri;
  }

  /**
   * Logs security warnings for development environment
   */
  private logSecurityWarnings(): void {
    const warnings = [];
    
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      warnings.push('VITE_GOOGLE_CLIENT_ID not configured');
    }
    
    if (!import.meta.env.VITE_GOOGLE_REDIRECT_URI) {
      warnings.push('VITE_GOOGLE_REDIRECT_URI not configured');
    }
    
    if (warnings.length > 0) {
      console.warn('🔒 Google OAuth Security Warnings:', warnings);
      console.warn('📋 To fix: Create .env file with proper OAuth credentials');
    }
  }

  /**
   * Enhanced authentication with better error handling
   */
  async authenticate(): Promise<any> {
    try {
      // In development with missing credentials, use mock mode
      if (import.meta.env.DEV && this.clientId === 'development-mock-client-id') {
        console.log('🔑 Development mode - Using simulated authentication');
        this.accessToken = 'mock_access_token';
        return { 
          authenticated: true, 
          message: 'Simulated authentication successful',
          mock: true 
        };
      }

      // In production or with proper credentials, generate OAuth URL
      const authUrl = this.generateAuthUrl();
      
      return { 
        authUrl, 
        message: 'Redirect to Google for authentication',
        authenticated: false 
      };
    } catch (error) {
      console.error('Authentication error:', error);
      
      if (error instanceof Error && error.message.includes('CRITICAL')) {
        throw error; // Re-throw critical configuration errors
      }
      
      throw new Error('Google authentication failed');
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