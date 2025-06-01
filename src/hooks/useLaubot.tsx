import { useState, useEffect, useCallback } from 'react';
import { Laubot } from '../lib/laubot';
import { googleCalendarService, CalendarEvent } from '../lib/googleCalendarService';

// Instancia única del bot para toda la aplicación
const laubotInstance = new Laubot().start();

export const useLaubot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Suscribirse a cambios del bot
  useEffect(() => {
    const handleStateChange = (snapshot: any) => {
      setIsLoading(laubotInstance.isLoading());
      setHasError(laubotInstance.hasError());
    };

    const unsubscribe = laubotInstance.subscribe(handleStateChange);
    
    return () => {
      unsubscribe();
    };
  }, []);

  const authenticate = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      // Usar el servicio actualizado
      const result = await googleCalendarService.authenticate();
      
      if (result.authenticated) {
        // Enviar evento al bot
        laubotInstance.send({ type: 'AUTHENTICATE' });
      } else if (result.authUrl) {
        // En un entorno real, redirigir a esta URL
        window.open(result.authUrl, '_blank');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error en autenticación:', error);
      setHasError(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      const eventsList = await googleCalendarService.listEvents({
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
      });
      
      setEvents(eventsList);
      console.log('📅 Eventos obtenidos:', eventsList.length);
      
      // Enviar evento al bot
      laubotInstance.send({ type: 'LIST_EVENTS' });
      
      return eventsList;
    } catch (error) {
      console.error('❌ Error listando eventos:', error);
      setHasError(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData: Partial<CalendarEvent>) => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      const newEvent = await googleCalendarService.createEvent(eventData as CalendarEvent);
      
      // Actualizar la lista de eventos
      setEvents(prev => [...prev, newEvent]);
      console.log('✨ Evento creado:', newEvent);
      
      // Enviar evento al bot
      laubotInstance.send({ type: 'CREATE_EVENT', event: newEvent });
      
      return newEvent;
    } catch (error) {
      console.error('❌ Error creando evento:', error);
      setHasError(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (eventId: string, updates: Partial<CalendarEvent>) => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      const updatedEvent = await googleCalendarService.updateEvent(eventId, updates);
      
      // Actualizar la lista de eventos
      setEvents(prev => prev.map(event => 
        event.id === eventId ? updatedEvent : event
      ));
      console.log('📝 Evento actualizado:', updatedEvent);
      
      // Enviar evento al bot
      laubotInstance.send({ type: 'UPDATE_EVENT', eventId, updates });
      
      return updatedEvent;
    } catch (error) {
      console.error('❌ Error actualizando evento:', error);
      setHasError(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    hasError,
    events,
    authenticate,
    listEvents,
    createEvent,
    updateEvent,
    // Estado del bot
    currentState: laubotInstance.getState().value,
    // Métodos del bot
    send: laubotInstance.send.bind(laubotInstance),
    // Servicio de calendario
    calendarService: googleCalendarService
  };
}; 