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
  MapPin,
  MessageSquare,
  TrendingUp,
  Mail,
  Bell,
  Target,
  BarChart3,
  BookOpen,
  Heart
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
  const [activeTab, setActiveTab] = useState('overview');

  // Get user's first name for greeting
  const getUserFirstName = () => {
    if (profile?.preferred_name) return profile.preferred_name;
    if (profile?.full_name) {
      const firstName = profile.full_name.split(' ')[0];
      return firstName;
    }
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'Usuario';
  };

  // Mock data for demonstration (will be replaced with real Google data)
  const mockStats = {
    totalMessages: 127,
    weeklyMessages: 23,
    dailyLimit: 7,
    todayUsed: 3,
    favoriteFeatures: ['Transcripción', 'Calendario', 'Ideas creativas'],
    recentActivity: [
      { type: 'message', content: 'Transcribiste un audio de 5 minutos', time: '2 horas' },
      { type: 'calendar', content: 'Creaste reunión con el equipo', time: '1 día' },
      { type: 'task', content: 'Completaste 3 tareas pendientes', time: '2 días' }
    ],
    upcomingEvents: [
      { title: 'Reunión con cliente', time: 'Hoy 15:00', type: 'meeting' },
      { title: 'Deadline proyecto X', time: 'Mañana', type: 'deadline' },
      { title: 'Llamada con proveedores', time: 'Jueves 10:00', type: 'call' }
    ]
  };

  // Cargar eventos de Supabase cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadSupabaseEvents();
    }
  }, [isAuthenticated, user?.id]);

  const loadSupabaseEvents = async () => {
    if (!user?.id) return;
    
    try {
      // This is a placeholder until calendar_events table is created
      console.log('Loading events - calendar_events table not yet created');
      setSupabaseEvents([]);
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
    
    console.log('Create event - calendar_events table not yet created');
    
    // Simulate creating an event for demo purposes
    const sampleEvent = {
      id: Math.random().toString(),
      title: 'Evento desde Dashboard',
      description: 'Creado desde el dashboard integrado',
      start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      location: 'Dashboard virtual',
      status: 'confirmed'
    };

    setSupabaseEvents(prev => [sampleEvent, ...prev]);
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
              🚀 Tu Centro de Control Personal
            </h1>
            <p className="text-xl text-vino/80 mb-8">
              Conectá con Google para sincronizar calendario, contactos y obtener insights personalizados de tu actividad con Lautaro.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-none shadow-md">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-vino" />
                  <h3 className="font-semibold text-vino text-sm">Google Calendar</h3>
                  <p className="text-xs text-vino/70">Sincronización automática</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-vino" />
                  <h3 className="font-semibold text-vino text-sm">Analytics</h3>
                  <p className="text-xs text-vino/70">Insights de uso</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-vino" />
                  <h3 className="font-semibold text-vino text-sm">Objetivos</h3>
                  <p className="text-xs text-vino/70">Seguimiento diario</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="p-4 text-center">
                  <Bot className="w-8 h-8 mx-auto mb-2 text-vino" />
                  <h3 className="font-semibold text-vino text-sm">Asistente IA</h3>
                  <p className="text-xs text-vino/70">Estado personalizado</p>
                </CardContent>
              </Card>
            </div>

            <Button 
              onClick={() => setShowAuthModal(true)}
              size="lg"
              className="bg-vino hover:bg-vino/90 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              🔑 Acceder al Dashboard
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
    <div className="min-h-screen bg-gradient-to-br from-beige via-sand to-[#ffd6c0] dark:from-[#201016] dark:to-[#442134]">
      <div className="container mx-auto py-6 px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border-2 border-vino/20">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-vino text-white font-semibold">
                {getUserFirstName().charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-vino dark:text-beige">
                ¡Hola, {getUserFirstName()}! 👋
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="outline" className="text-xs">
                  Nivel {profile?.chamuyo_level || 1}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {profile?.total_points || 0} puntos
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <MessageSquare className="w-4 h-4" />
                  <span>{mockStats.todayUsed}/{mockStats.dailyLimit} mensajes hoy</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSync}
              disabled={syncLoading}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {syncLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Sincronizar
            </Button>
            
            <Button
              onClick={signOut}
              variant="outline"
              size="sm" 
              className="text-xs text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white/50 dark:bg-gray-800/50 p-1 rounded-xl">
          {[
            { id: 'overview', label: 'Resumen', icon: Activity },
            { id: 'calendar', label: 'Calendario', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Configuración', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-vino dark:text-beige shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-vino dark:hover:text-beige'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Card className="border-none shadow-lg bg-gradient-to-r from-coral to-orange-400 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Mensajes este mes</p>
                      <p className="text-3xl font-bold">{mockStats.totalMessages}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-gradient-to-r from-vino to-purple-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Esta semana</p>
                      <p className="text-3xl font-bold">{mockStats.weeklyMessages}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-gradient-to-r from-green-400 to-blue-500 text-white sm:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Funciones más usadas</h3>
                    <Star className="w-6 h-6" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mockStats.favoriteFeatures.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/20 text-white border-none">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-vino" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  {mockStats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'message' ? 'bg-blue-500' :
                        activity.type === 'calendar' ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-gray-100">{activity.content}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Hace {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-none shadow-lg lg:col-span-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-vino" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockStats.upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        event.type === 'meeting' ? 'bg-blue-500' :
                        event.type === 'deadline' ? 'bg-red-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-vino/50" />
            <h3 className="text-xl font-semibold text-vino dark:text-beige mb-2">
              Calendario Sincronizado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Conectá con Google Calendar para ver y gestionar tus eventos aquí.
            </p>
            <Button className="bg-vino hover:bg-vino/90">
              🔗 Conectar Google Calendar
            </Button>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="text-center py-16">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-vino/50" />
            <h3 className="text-xl font-semibold text-vino dark:text-beige mb-2">
              Analytics Avanzados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Próximamente: insights detallados sobre tu productividad y uso de Lautaro.
            </p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center py-16">
            <Settings className="w-16 h-16 mx-auto mb-4 text-vino/50" />
            <h3 className="text-xl font-semibold text-vino dark:text-beige mb-2">
              Configuración
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Personalizá tu experiencia con Lautaro y gestiona integraciones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseDashboard;
