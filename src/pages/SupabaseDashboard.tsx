
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLaubot } from '../hooks/useLaubot';
import { supabase } from '../integrations/supabase/client';
import AuthModal from '../components/AuthModal';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  Calendar,
  Settings,
  User,
  Trophy,
  Star,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  Bot,
  RefreshCw,
  Plus,
  Loader2,
  AlertCircle,
  MapPin
} from 'lucide-react';

const SupabaseDashboard = () => {
  const { 
    user, 
    profile, 
    loading: authLoading, 
    isAuthenticated, 
    signOut 
  } = useAuth();
  
  const {
    isLoading: botLoading,
    hasError: botError,
    events: botEvents,
    authenticate: authenticateBot,
    listEvents,
    createEvent
  } = useLaubot();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [supabaseEvents, setSupabaseEvents] = useState<any[]>([]);
  const [syncLoading, setSyncLoading] = useState(false);

  // Cargar eventos de Supabase cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadSupabaseEvents();
    }
  }, [isAuthenticated, user?.id]);

  const loadSupabaseEvents = async () => {
    if (!user?.id) return;
    
    try {
      const { data: events, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading events:', error);
        return;
      }

      setSupabaseEvents(events || []);
    } catch (error) {
      console.error('Error loading Supabase events:', error);
    }
  };

  const handleSync = async () => {
    if (!user?.id) return;
    
    setSyncLoading(true);
    try {
      // Aquí podrías implementar la lógica de sincronización
      // Por ahora solo recargamos los eventos
      await loadSupabaseEvents();
      console.log('Sincronización exitosa');
    } catch (error) {
      console.error('Error syncing:', error);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!user?.id) return;
    
    const sampleEvent = {
      user_id: user.id,
      title: 'Evento desde Dashboard',
      description: 'Creado desde el dashboard integrado',
      start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      location: 'Dashboard virtual',
      all_day: false,
      status: 'confirmed'
    };

    try {
      const { error } = await supabase
        .from('calendar_events')
        .insert(sampleEvent);

      if (error) {
        console.error('Error creating event:', error);
        return;
      }

      await loadSupabaseEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-AR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige to-sand flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-vino" />
          <p className="text-vino">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige to-sand">
        <div className="container mx-auto py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-vino mb-6 font-quicksand">
              🔐 Dashboard Integrado
            </h1>
            <p className="text-xl text-vino/80 mb-8">
              Accede a tu asistente personal con calendario sincronizado y persistencia en tiempo real.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <User className="w-8 h-8 mx-auto mb-3 text-vino" />
                  <h3 className="font-semibold text-vino mb-2">Autenticación</h3>
                  <p className="text-sm text-vino/70">Login seguro con Supabase</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Bot className="w-8 h-8 mx-auto mb-3 text-vino" />
                  <h3 className="font-semibold text-vino mb-2">Bot Inteligente</h3>
                  <p className="text-sm text-vino/70">Estados persistentes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-3 text-vino" />
                  <h3 className="font-semibold text-vino mb-2">Calendario</h3>
                  <p className="text-sm text-vino/70">Sincronización automática</p>
                </CardContent>
              </Card>
            </div>

            <Button 
              onClick={() => setShowAuthModal(true)}
              size="lg"
              className="bg-vino hover:bg-vino/90 text-white px-8 py-3"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige to-sand">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-vino">
                ¡Hola, {profile?.full_name || user?.email}!
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Nivel {profile?.chamuyo_level || 1}
                </Badge>
                <Badge variant="outline">
                  {profile?.total_points || 0} puntos
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </Button>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel del Bot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Laubot - Estado del Asistente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${botError ? 'bg-red-500' : botLoading ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <span className="text-sm">
                  {botError ? 'Error' : botLoading ? 'Procesando...' : 'Listo'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={authenticateBot} 
                  disabled={botLoading}
                  size="sm"
                >
                  🔑 Autenticar Google
                </Button>
                <Button 
                  onClick={() => listEvents()} 
                  disabled={botLoading}
                  size="sm"
                  variant="outline"
                >
                  📅 Listar Eventos
                </Button>
                <Button 
                  onClick={handleCreateEvent} 
                  disabled={botLoading}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Crear Evento
                </Button>
              </div>

              {botEvents.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Eventos del Bot:</h4>
                  <div className="space-y-2">
                    {botEvents.slice(0, 3).map((event: any, index: number) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="font-medium">{event.summary}</div>
                        {event.start?.dateTime && (
                          <div className="text-gray-600 text-xs">
                            {formatDateTime(event.start.dateTime)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Panel de Calendario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Calendario Sincronizado
                <Button 
                  onClick={handleSync}
                  disabled={syncLoading}
                  size="sm"
                  variant="ghost"
                >
                  <RefreshCw className={`w-4 h-4 ${syncLoading ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {supabaseEvents.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay eventos guardados</p>
                  <p className="text-sm">Sincroniza con Google Calendar o crea eventos nuevos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {supabaseEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium text-vino">{event.title}</h4>
                            {event.description && (
                              <p className="text-sm text-gray-600">{event.description}</p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDateTime(event.start_time)}
                              </div>
                              
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                            {event.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-vino">{supabaseEvents.length}</div>
              <div className="text-sm text-gray-600">Eventos guardados</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-vino">{profile?.chamuyo_level || 1}</div>
              <div className="text-sm text-gray-600">Nivel actual</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-vino">{profile?.total_points || 0}</div>
              <div className="text-sm text-gray-600">Puntos totales</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-vino">
                {profile?.subscription_status === 'premium' ? '✨' : '🆓'}
              </div>
              <div className="text-sm text-gray-600">
                {profile?.subscription_status === 'premium' ? 'Premium' : 'Gratis'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupabaseDashboard;
