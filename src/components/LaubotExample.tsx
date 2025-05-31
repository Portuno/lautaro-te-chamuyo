import React from 'react';
import { useLaubot } from '../hooks/useLaubot';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, User, AlertCircle, Loader2 } from 'lucide-react';
import type { CalendarEvent } from '../lib/googleCalendarService';

const LaubotExample = () => {
  const {
    isLoading,
    hasError,
    events,
    authenticate,
    listEvents,
    updateEvent,
    createEvent,
    currentState,
    calendarService
  } = useLaubot();

  // Derive authentication status from calendar service
  const isAuthenticated = calendarService.isAuthenticated();

  const handleCreateSampleEvent = () => {
    const sampleEvent: CalendarEvent = {
      summary: 'Reunión de prueba',
      description: 'Evento creado desde Laubot',
      start: {
        dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // En 1 hora
        timeZone: 'America/Argentina/Buenos_Aires'
      },
      end: {
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // En 2 horas
        timeZone: 'America/Argentina/Buenos_Aires'
      },
      location: 'Oficina virtual'
    };
    createEvent(sampleEvent);
  };

  const handleUpdateFirstEvent = () => {
    if (events.length > 0) {
      updateEvent(events[0].id!, {
        summary: 'Evento actualizado desde Laubot'
      });
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('es-AR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    if (hasError) return 'bg-red-100 border-red-300';
    if (isAuthenticated) return 'bg-green-100 border-green-300';
    if (isLoading) return 'bg-yellow-100 border-yellow-300';
    return 'bg-gray-100 border-gray-300';
  };

  const getStatusText = () => {
    if (hasError) return 'Error';
    if (isAuthenticated) return 'Autenticado';
    if (isLoading) return 'Cargando...';
    return 'No autenticado';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤵‍♂️ Laubot - Asistente Personal
            <Badge className={`${getStatusColor()} text-xs`}>
              {getStatusText()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estado actual */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {currentState && (
              <span>Ejecutando: <code className="bg-gray-100 px-2 py-1 rounded">{currentState}</code></span>
            )}
            {!currentState && !isLoading && <span>En espera</span>}
          </div>

          {/* Error */}
          {hasError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{currentState}</span>
              <Button onClick={() => {}} size="sm" variant="outline" className="ml-auto">
                Reintentar
              </Button>
            </div>
          )}

          {/* Controles */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={authenticate} 
              disabled={isLoading || isAuthenticated}
              variant={isAuthenticated ? "outline" : "default"}
            >
              {isAuthenticated ? '✅ Autenticado' : '🔑 Autenticar con Google'}
            </Button>
            
            <Button 
              onClick={() => listEvents()} 
              disabled={isLoading || !isAuthenticated}
              variant="outline"
            >
              📅 Listar Eventos
            </Button>
            
            <Button 
              onClick={handleCreateSampleEvent} 
              disabled={isLoading || !isAuthenticated}
              variant="outline"
            >
              ✨ Crear Evento de Prueba
            </Button>
            
            <Button 
              onClick={handleUpdateFirstEvent} 
              disabled={isLoading || !isAuthenticated || events.length === 0}
              variant="outline"
            >
              📝 Actualizar Primer Evento
            </Button>
            
            <Button 
              onClick={() => {}} 
              variant="outline"
              size="sm"
            >
              🔄 Reset
            </Button>
          </div>

          {/* Lista de eventos */}
          {events.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">📅 Próximos Eventos</h3>
              <div className="grid gap-3">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-medium text-vino">{event.summary}</h4>
                          {event.description && (
                            <p className="text-sm text-gray-600">{event.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {event.start.dateTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDateTime(event.start.dateTime)}
                              </div>
                            )}
                            
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => updateEvent(event.id!, { 
                            summary: `${event.summary} (actualizado)` 
                          })}
                          size="sm"
                          variant="ghost"
                          disabled={isLoading}
                        >
                          📝 Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Información del estado interno */}
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700">Debug Info</summary>
            <pre className="mt-2 p-2 bg-gray-50 rounded overflow-auto">
              {JSON.stringify({ 
                isLoading, 
                hasError, 
                currentState, 
                isAuthenticated,
                eventsCount: events.length 
              }, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaubotExample; 