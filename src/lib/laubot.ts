import { googleCalendarService, CalendarEvent } from './googleCalendarService';

// Estados posibles del bot
type BotState = 'idle' | 'authenticating' | 'authenticated' | 'listing_events' | 'updating_event' | 'creating_event' | 'error';

// Eventos que puede recibir el bot
type LaubotEvent = 
  | { type: 'AUTHENTICATE' }
  | { type: 'LIST_EVENTS'; params?: { timeMin?: string; timeMax?: string; maxResults?: number } }
  | { type: 'UPDATE_EVENT'; eventId: string; updates: any }
  | { type: 'CREATE_EVENT'; event: any }
  | { type: 'RESET' }
  | { type: 'RETRY' };

// Contexto del bot
interface LaubotContext {
  credentials: any;
  events: CalendarEvent[];
  error: string | null;
  currentAction: string | null;
}

// Clase principal del bot
export class Laubot {
  private state: BotState = 'idle';
  private context: LaubotContext = {
    credentials: null,
    events: [],
    error: null,
    currentAction: null
  };
  private listeners: Set<(state: any) => void> = new Set();
  
  constructor() {
    // Inicialización del bot
  }
  
  // Iniciar el bot
  start() {
    console.log('🤖 Laubot iniciado');
    return this;
  }
  
  // Detener el bot
  stop() {
    console.log('🤖 Laubot detenido');
    return this;
  }
  
  // Obtener estado actual
  getState() {
    return {
      value: this.state,
      context: this.context
    };
  }
  
  // Obtener contexto actual
  getContext() {
    return this.context;
  }
  
  // Enviar evento al bot
  async send(event: LaubotEvent) {
    try {
      await this.handleEvent(event);
    } catch (error) {
      console.error('Error handling event:', error);
      this.setState('error', { error: error instanceof Error ? error.message : 'Error desconocido' });
    }
    return this;
  }
  
  // Manejar eventos
  private async handleEvent(event: LaubotEvent) {
    switch (event.type) {
      case 'AUTHENTICATE':
        await this.handleAuthenticate();
        break;
        
      case 'LIST_EVENTS':
        await this.handleListEvents(event.params);
        break;
        
      case 'UPDATE_EVENT':
        await this.handleUpdateEvent(event.eventId, event.updates);
        break;
        
      case 'CREATE_EVENT':
        await this.handleCreateEvent(event.event);
        break;
        
      case 'RESET':
      case 'RETRY':
        this.handleReset();
        break;
        
      default:
        console.warn('Evento no reconocido:', event);
    }
  }
  
  // Manejar autenticación
  private async handleAuthenticate() {
    this.setState('authenticating', { 
      currentAction: 'get_credentials',
      error: null 
    });
    
    try {
      const result = await googleCalendarService.authenticate();
      this.setState('authenticated', {
        credentials: result,
        currentAction: null
      });
    } catch (error) {
      this.setState('error', {
        error: error instanceof Error ? error.message : 'Error de autenticación',
        currentAction: null
      });
    }
  }
  
  // Manejar listado de eventos
  private async handleListEvents(params?: any) {
    this.setState('listing_events', {
      currentAction: 'calendar.list_events',
      error: null
    });
    
    try {
      const events = await googleCalendarService.listEvents(params || {});
      this.setState('authenticated', {
        events,
        currentAction: null
      });
    } catch (error) {
      this.setState('error', {
        error: error instanceof Error ? error.message : 'Error al listar eventos',
        currentAction: null
      });
    }
  }
  
  // Manejar actualización de evento
  private async handleUpdateEvent(eventId: string, updates: any) {
    this.setState('updating_event', {
      currentAction: 'calendar.update_event',
      error: null
    });
    
    try {
      await googleCalendarService.updateEvent(eventId, updates);
      this.setState('authenticated', {
        currentAction: null
      });
    } catch (error) {
      this.setState('error', {
        error: error instanceof Error ? error.message : 'Error al actualizar evento',
        currentAction: null
      });
    }
  }
  
  // Manejar creación de evento
  private async handleCreateEvent(event: any) {
    this.setState('creating_event', {
      currentAction: 'calendar.create_event',
      error: null
    });
    
    try {
      await googleCalendarService.createEvent(event);
      this.setState('authenticated', {
        currentAction: null
      });
    } catch (error) {
      this.setState('error', {
        error: error instanceof Error ? error.message : 'Error al crear evento',
        currentAction: null
      });
    }
  }
  
  // Manejar reset
  private handleReset() {
    this.setState('idle', {
      error: null,
      currentAction: null
    });
  }
  
  // Cambiar estado y notificar listeners
  private setState(newState: BotState, contextUpdates: Partial<LaubotContext> = {}) {
    this.state = newState;
    this.context = { ...this.context, ...contextUpdates };
    
    const stateSnapshot = {
      value: this.state,
      context: this.context
    };
    
    this.notifyListeners(stateSnapshot);
  }
  
  // Suscribirse a cambios de estado
  subscribe(listener: (state: any) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  // Notificar a todos los listeners
  private notifyListeners(state: any) {
    this.listeners.forEach(listener => listener(state));
  }
  
  // Métodos de conveniencia para las acciones principales
  authenticate() {
    return this.send({ type: 'AUTHENTICATE' });
  }
  
  listEvents(params?: { timeMin?: string; timeMax?: string; maxResults?: number }) {
    return this.send({ type: 'LIST_EVENTS', params });
  }
  
  updateEvent(eventId: string, updates: any) {
    return this.send({ type: 'UPDATE_EVENT', eventId, updates });
  }
  
  createEvent(event: any) {
    return this.send({ type: 'CREATE_EVENT', event });
  }
  
  reset() {
    return this.send({ type: 'RESET' });
  }
  
  retry() {
    return this.send({ type: 'RETRY' });
  }
  
  // Estado de carga
  isLoading() {
    return ['authenticating', 'listing_events', 'updating_event', 'creating_event'].includes(this.state);
  }
  
  // Estado de error
  hasError() {
    return this.state === 'error';
  }
  
  // Obtener error actual
  getError() {
    return this.context.error;
  }
  
  // Obtener acción actual
  getCurrentAction() {
    return this.context.currentAction;
  }
  
  // Obtener eventos
  getEvents() {
    return this.context.events;
  }
}

// Instancia singleton para usar en la aplicación
export const laubotService = new Laubot().start(); 