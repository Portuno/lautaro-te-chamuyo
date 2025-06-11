import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';

interface UserLevel {
  level_number: number;
  name: string;
  description: string;
  badge_emoji: string;
  color_hex: string;
  progress_to_next: number;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  subscription_status: string;
  chamuyo_level: number;
  total_points: number;
  onboarding_completed: boolean;
  preferred_name: string | null;
  interaction_style: string | null;
  interests: string[] | null;
  lautaro_mood: string | null;
  created_at: string;
}

interface UserStats {
  total_conversations: number;
  total_messages: number;
  days_active: number;
  favorite_time: string;
  longest_conversation: number;
}

const Profile: React.FC = () => {
  const { isAuthenticated, profile: authProfile } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'preferences' | 'achievements'>('overview');

  useEffect(() => {
    if (isAuthenticated && authProfile) {
      fetchUserData();
    }
  }, [isAuthenticated, authProfile]);

  const fetchUserData = async () => {
    try {
      // Obtener perfil completo del usuario
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authProfile?.id)
        .single();

      if (profileError) throw profileError;
      setUserProfile(profileData);

      // Obtener nivel actual basado en chamuyo_level (temporal hasta que se ejecute el SQL)
      const mockLevels = [
        { level_number: 1, name: 'Pibe Nuevo', description: 'Recién llegás al barrio del chamuyo', min_points: 0, max_points: 99, badge_emoji: '👶', color_hex: '#8B4513' },
        { level_number: 2, name: 'Vecino del Barrio', description: 'Ya te conocen en la cuadra', min_points: 100, max_points: 199, badge_emoji: '🏠', color_hex: '#654321' },
        { level_number: 3, name: 'Amigo del Kiosquero', description: 'El kiosquero ya te fía', min_points: 200, max_points: 349, badge_emoji: '🏪', color_hex: '#8B4513' },
        { level_number: 4, name: 'Hincha de Corazón', description: 'Elegiste tu cuadro favorito', min_points: 350, max_points: 549, badge_emoji: '⚽', color_hex: '#FF6B35' },
        { level_number: 5, name: 'Asador Principiante', description: 'Sabés prender el fuego', min_points: 550, max_points: 799, badge_emoji: '🔥', color_hex: '#D2691E' },
        { level_number: 6, name: 'Tomador de Mate', description: 'Ya sabés cebar como la gente', min_points: 800, max_points: 1099, badge_emoji: '🧉', color_hex: '#228B22' },
        { level_number: 7, name: 'Conocedor de Tangos', description: 'Distinguís un Gardel de un Pugliese', min_points: 1100, max_points: 1449, badge_emoji: '🎵', color_hex: '#4B0082' },
        { level_number: 8, name: 'Porteño Honorario', description: 'Hablás como de Barracas', min_points: 1450, max_points: 1849, badge_emoji: '🏙️', color_hex: '#FF69B4' },
        { level_number: 9, name: 'Gaucho de Escritorio', description: 'Trabajás pero con alma de campo', min_points: 1850, max_points: 2299, badge_emoji: '🤠', color_hex: '#8B4513' },
        { level_number: 10, name: 'Maestro del Asado', description: 'Tu asado es legendario', min_points: 2300, max_points: 2799, badge_emoji: '🥩', color_hex: '#B22222' },
        { level_number: 11, name: 'Filósofo de Café', description: 'Resolvés la vida en un cortado', min_points: 2800, max_points: 3349, badge_emoji: '☕', color_hex: '#8B4513' },
        { level_number: 12, name: 'Barra Brava', description: 'Aguantás a tu equipo en las malas', min_points: 3350, max_points: 3949, badge_emoji: '🎺', color_hex: '#FF4500' },
        { level_number: 13, name: 'Caminador de Buenos Aires', description: 'Conocés cada esquina de CABA', min_points: 3950, max_points: 4599, badge_emoji: '🚶', color_hex: '#4682B4' },
        { level_number: 14, name: 'Experto en Empanadas', description: 'Distinguís una tucumana de una salteña', min_points: 4600, max_points: 5299, badge_emoji: '🥟', color_hex: '#FFD700' },
        { level_number: 15, name: 'Milonguero', description: 'Bailás tango como Carlos Gardel cantaba', min_points: 5300, max_points: 6049, badge_emoji: '💃', color_hex: '#8A2BE2' },
        { level_number: 16, name: 'Conocedor de Vinos', description: 'Distinguís un Malbec de Mendoza con los ojos cerrados', min_points: 6050, max_points: 6849, badge_emoji: '🍷', color_hex: '#722F37' },
        { level_number: 17, name: 'Prócer del Chamuyo', description: 'San Martín te pediría consejos', min_points: 6850, max_points: 7699, badge_emoji: '🎖️', color_hex: '#DAA520' },
        { level_number: 18, name: 'Crack del Barrio', description: 'Sos como Maradona pero del chamuyo', min_points: 7700, max_points: 8599, badge_emoji: '⭐', color_hex: '#FFD700' },
        { level_number: 19, name: 'Leyenda Viviente', description: 'Como Evita, pero para el chamuyo', min_points: 8600, max_points: 9549, badge_emoji: '👑', color_hex: '#FF1493' },
        { level_number: 20, name: 'Dios del Chamuyo', description: 'Nivel Messi del chamuyo', min_points: 9550, max_points: 10549, badge_emoji: '🐐', color_hex: '#00FF00' },
        { level_number: 21, name: 'Inmortal del Río de la Plata', description: 'Trascendiste como Borges', min_points: 10550, max_points: 11599, badge_emoji: '🌟', color_hex: '#9370DB' },
        { level_number: 22, name: 'El Mismísimo Lautaro', description: 'Llegaste al nivel de tu maestro', min_points: 11600, max_points: 999999, badge_emoji: '🔥', color_hex: '#FF0000' }
      ];

      // Buscar el nivel actual basado en puntos
      const currentLevelData = mockLevels.find(level => 
        profileData.total_points >= level.min_points && profileData.total_points <= level.max_points
      ) || mockLevels[0]; // Fallback al nivel 1

      // Buscar el siguiente nivel
      const nextLevelData = mockLevels.find(level => level.level_number === currentLevelData.level_number + 1);
      
      let progress_to_next = 100; // Nivel máximo por defecto
      if (nextLevelData) {
        const currentProgress = profileData.total_points - currentLevelData.min_points;
        const totalNeeded = nextLevelData.min_points - currentLevelData.min_points;
        progress_to_next = Math.round((currentProgress / totalNeeded) * 100);
      }
      
      setUserLevel({
        level_number: currentLevelData.level_number,
        name: currentLevelData.name,
        description: currentLevelData.description,
        badge_emoji: currentLevelData.badge_emoji,
        color_hex: currentLevelData.color_hex,
        progress_to_next: progress_to_next
      });

      // Obtener estadísticas del usuario
      await fetchUserStats(authProfile.id);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async (userId: string) => {
    try {
      // Obtener estadísticas de conversaciones
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id, message_count, created_at')
        .eq('user_id', userId);

      if (convError) throw convError;

      // Obtener total de mensajes
      const { count: totalMessages, error: msgError } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (msgError) throw msgError;

      // Calcular estadísticas
      const totalConversations = conversations?.length || 0;
      const longestConversation = Math.max(...(conversations?.map(c => c.message_count) || [0]));
      
      // Calcular días activos (días únicos con conversaciones)
      const uniqueDays = new Set(
        conversations?.map(c => new Date(c.created_at).toDateString()) || []
      ).size;

      const stats: UserStats = {
        total_conversations: totalConversations,
        total_messages: totalMessages || 0,
        days_active: uniqueDays,
        favorite_time: 'Mañana', // Esto se puede calcular más tarde con datos reales
        longest_conversation: longestConversation
      };

      setUserStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige via-sand to-[#ffd6c0] dark:from-[#201016] dark:to-[#442134] flex items-center justify-center">
        <div className="text-center p-8 bg-white/90 dark:bg-[#2e1e21]/90 rounded-2xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-vino dark:text-beige mb-4">
            Acceso Requerido
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Necesitás iniciar sesión para ver tu perfil.
          </p>
          <button className="bg-vino hover:bg-vino/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige via-sand to-[#ffd6c0] dark:from-[#201016] dark:to-[#442134] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vino mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = userLevel?.progress_to_next || 0;
  const nextLevelPoints = userProfile ? Math.ceil((userProfile.total_points / (progressPercentage / 100)) - userProfile.total_points) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-sand to-[#ffd6c0] dark:from-[#201016] dark:to-[#442134] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header del perfil */}
        <div className="bg-white/90 dark:bg-[#2e1e21]/90 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-vino to-[#d4374a] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userProfile?.full_name?.[0]?.toUpperCase() || userProfile?.preferred_name?.[0]?.toUpperCase() || '?'}
              </div>
              {userLevel && (
                <div 
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: userLevel.color_hex }}
                >
                  {userLevel.badge_emoji}
                </div>
              )}
            </div>

            {/* Información básica */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-vino dark:text-beige mb-2">
                {userProfile?.preferred_name || userProfile?.full_name || 'Chamuyero Anónimo'}
              </h1>
              
              {userLevel && (
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <span className="text-xl">{userLevel.badge_emoji}</span>
                  <span className="text-lg font-semibold" style={{ color: userLevel.color_hex }}>
                    {userLevel.name}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    (Nivel {userLevel.level_number})
                  </span>
                </div>
              )}

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {userProfile?.bio || userLevel?.description || 'Un chamuyero en desarrollo...'}
              </p>

              {/* Barra de progreso */}
              {userLevel && progressPercentage < 100 && (
                <div className="w-full max-w-md mx-auto md:mx-0">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>{userProfile?.total_points} puntos</span>
                    <span>{nextLevelPoints} para siguiente nivel</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${progressPercentage}%`,
                        backgroundColor: userLevel.color_hex 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {progressPercentage.toFixed(1)}% al siguiente nivel
                  </p>
                </div>
              )}
            </div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-vino/10 dark:bg-vino/20 rounded-lg p-3">
                <div className="text-xl font-bold text-vino dark:text-beige">
                  {userStats?.total_conversations || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Conversaciones
                </div>
              </div>
              <div className="bg-vino/10 dark:bg-vino/20 rounded-lg p-3">
                <div className="text-xl font-bold text-vino dark:text-beige">
                  {userStats?.total_messages || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Mensajes
                </div>
              </div>
              <div className="bg-vino/10 dark:bg-vino/20 rounded-lg p-3">
                <div className="text-xl font-bold text-vino dark:text-beige">
                  {userStats?.days_active || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Días Activo
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="bg-white/90 dark:bg-[#2e1e21]/90 rounded-2xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'overview', label: 'Vista General', icon: '👤' },
              { id: 'stats', label: 'Estadísticas', icon: '📊' },
              { id: 'preferences', label: 'Preferencias', icon: '⚙️' },
              { id: 'achievements', label: 'Logros', icon: '🏆' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-center transition-colors ${
                  activeTab === tab.id
                    ? 'text-vino dark:text-beige border-b-2 border-vino bg-vino/5'
                    : 'text-gray-600 dark:text-gray-400 hover:text-vino dark:hover:text-beige'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Contenido de las tabs */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-vino dark:text-beige mb-4">
                    Información Personal
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre Completo
                      </label>
                      <p className="text-gray-900 dark:text-gray-100">
                        {userProfile?.full_name || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre Preferido
                      </label>
                      <p className="text-gray-900 dark:text-gray-100">
                        {userProfile?.preferred_name || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ubicación
                      </label>
                      <p className="text-gray-900 dark:text-gray-100">
                        {userProfile?.location || 'No especificada'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Suscripción
                      </label>
                      <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                        userProfile?.subscription_status === 'premium' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {userProfile?.subscription_status === 'premium' ? '👑 Premium' : '🆓 Gratis'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-vino dark:text-beige mb-4">
                    Estilo de Chamuyo
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estilo de Interacción
                      </label>
                      <p className="text-gray-900 dark:text-gray-100 capitalize">
                        {userProfile?.interaction_style || 'No definido'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mood de Lautaro Preferido
                      </label>
                      <p className="text-gray-900 dark:text-gray-100 capitalize">
                        {userProfile?.lautaro_mood || 'No definido'}
                      </p>
                    </div>
                  </div>
                  
                  {userProfile?.interests && userProfile.interests.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Intereses
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.interests.map((interest, index) => (
                          <span 
                            key={index}
                            className="inline-flex px-3 py-1 rounded-full text-sm bg-vino/10 text-vino dark:bg-vino/20 dark:text-beige"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'stats' && userStats && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-vino dark:text-beige mb-4">
                  Tus Estadísticas de Chamuyo
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 text-center">
                    <div className="text-3xl mb-2">💬</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {userStats.total_conversations}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Conversaciones Totales
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 text-center">
                    <div className="text-3xl mb-2">📝</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {userStats.total_messages}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Mensajes Enviados
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6 text-center">
                    <div className="text-3xl mb-2">📅</div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {userStats.days_active}
                    </div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">
                      Días Activo
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-6 text-center">
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {userStats.longest_conversation}
                    </div>
                    <div className="text-sm text-orange-600 dark:text-orange-400">
                      Conversación Más Larga
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg p-6 text-center">
                    <div className="text-3xl mb-2">⏰</div>
                    <div className="text-2xl font-bold text-pink-700 dark:text-pink-300">
                      {userStats.favorite_time}
                    </div>
                    <div className="text-sm text-pink-600 dark:text-pink-400">
                      Horario Favorito
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-6 text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                      {userProfile?.total_points}
                    </div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">
                      Puntos de Chamuyo
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-vino dark:text-beige mb-4">
                  Preferencias de Chamuyo
                </h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      🎭 Estilo de Interacción: {userProfile?.interaction_style || 'No definido'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cómo preferís que Lautaro se comunique con vos
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      😊 Mood de Lautaro: {userProfile?.lautaro_mood || 'No definido'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      El estado de ánimo que más te gusta de Lautaro
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      ✅ Onboarding Completado: {userProfile?.onboarding_completed ? 'Sí' : 'No'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Estado del proceso de introducción inicial
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-vino dark:text-beige mb-4">
                  Logros y Badges
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Logros básicos */}
                  <div className={`p-4 rounded-lg border-2 ${
                    userStats?.total_conversations ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 bg-gray-50 dark:bg-gray-800/20'
                  }`}>
                    <div className="text-2xl mb-2">💬</div>
                    <h4 className="font-semibold">Primera Conversación</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {userStats?.total_conversations ? '¡Desbloqueado!' : 'Iniciá tu primera conversación'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${
                    (userStats?.total_messages || 0) >= 10 ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 bg-gray-50 dark:bg-gray-800/20'
                  }`}>
                    <div className="text-2xl mb-2">🗣️</div>
                    <h4 className="font-semibold">Chamuyero Activo</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(userStats?.total_messages || 0) >= 10 ? '¡Desbloqueado!' : 'Enviá 10 mensajes'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${
                    (userStats?.days_active || 0) >= 3 ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 bg-gray-50 dark:bg-gray-800/20'
                  }`}>
                    <div className="text-2xl mb-2">📅</div>
                    <h4 className="font-semibold">Fiel Compañero</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(userStats?.days_active || 0) >= 3 ? '¡Desbloqueado!' : 'Chateá 3 días diferentes'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${
                    userProfile?.onboarding_completed ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 bg-gray-50 dark:bg-gray-800/20'
                  }`}>
                    <div className="text-2xl mb-2">🎓</div>
                    <h4 className="font-semibold">Iniciado en el Chamuyo</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {userProfile?.onboarding_completed ? '¡Desbloqueado!' : 'Completá el onboarding'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${
                    (userProfile?.chamuyo_level || 1) >= 5 ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 bg-gray-50 dark:bg-gray-800/20'
                  }`}>
                    <div className="text-2xl mb-2">🔥</div>
                    <h4 className="font-semibold">Asador Principiante</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(userProfile?.chamuyo_level || 1) >= 5 ? '¡Desbloqueado!' : 'Llegá al nivel 5'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${
                    (userProfile?.chamuyo_level || 1) >= 10 ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 bg-gray-50 dark:bg-gray-800/20'
                  }`}>
                    <div className="text-2xl mb-2">🥩</div>
                    <h4 className="font-semibold">Maestro del Asado</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(userProfile?.chamuyo_level || 1) >= 10 ? '¡Desbloqueado!' : 'Llegá al nivel 10'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información del nivel actual */}
        {userLevel && (
          <div className="bg-white/90 dark:bg-[#2e1e21]/90 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-vino dark:text-beige mb-4">
              Tu Nivel Actual de Chamuyo
            </h3>
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: userLevel.color_hex }}
              >
                {userLevel.badge_emoji}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {userLevel.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {userLevel.description}
                </p>
                {userLevel.level_number < 22 && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Próximo nivel: Necesitás {nextLevelPoints} puntos más
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 