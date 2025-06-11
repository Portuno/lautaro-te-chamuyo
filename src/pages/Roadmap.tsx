import React, { useState } from 'react';
import { CheckCircle, Clock, Calendar, Zap, Users, Star, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSEO } from '../hooks/useSEO';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned' | 'future';
  priority: 'high' | 'medium' | 'low';
  quarter: string;
  category: 'core' | 'integrations' | 'ai' | 'ux' | 'enterprise';
  votes: number;
}

const roadmapData: RoadmapItem[] = [
  // Q4 2024 - Completed
  {
    id: 'chat-basic',
    title: 'Chat Básico con IA',
    description: 'Implementación del sistema de chat principal con respuestas inteligentes y personalidad argentina.',
    status: 'completed',
    priority: 'high',
    quarter: 'Q4 2024',
    category: 'core',
    votes: 234
  },
  {
    id: 'auth-system',
    title: 'Sistema de Autenticación',
    description: 'Login/registro con Supabase, perfiles de usuario y sistema de niveles.',
    status: 'completed',
    priority: 'high',
    quarter: 'Q4 2024',
    category: 'core',
    votes: 189
  },
  {
    id: 'daily-limits',
    title: 'Límites Diarios Gamificados',
    description: 'Sistema de 7 mensajes diarios con respuestas de despedida personalizadas.',
    status: 'completed',
    priority: 'medium',
    quarter: 'Q4 2024',
    category: 'core',
    votes: 156
  },

  // Q1 2025 - In Progress
  {
    id: 'google-calendar',
    title: 'Integración Google Calendar',
    description: 'Sincronización completa con Google Calendar para gestión de eventos y recordatorios.',
    status: 'in-progress',
    priority: 'high',
    quarter: 'Q1 2025',
    category: 'integrations',
    votes: 342
  },
  {
    id: 'voice-transcription',
    title: 'Transcripción de Audio',
    description: 'Capacidad para transcribir audios de WhatsApp, reuniones y notas de voz.',
    status: 'in-progress',
    priority: 'high',
    quarter: 'Q1 2025',
    category: 'ai',
    votes: 298
  },

  // Q2 2025 - Planned
  {
    id: 'gmail-integration',
    title: 'Integración Gmail',
    description: 'Gestión inteligente de emails, respuestas automáticas y resúmenes de bandeja.',
    status: 'planned',
    priority: 'high',
    quarter: 'Q2 2025',
    category: 'integrations',
    votes: 234
  },
  {
    id: 'document-analysis',
    title: 'Análisis de Documentos',
    description: 'Capacidad para leer, resumir y extraer información de PDFs y documentos.',
    status: 'planned',
    priority: 'medium',
    quarter: 'Q2 2025',
    category: 'ai',
    votes: 201
  },

  // Q3 2025 - Future
  {
    id: 'mobile-app',
    title: 'App Mobile Nativa',
    description: 'Aplicación móvil completa para iOS y Android con funciones offline.',
    status: 'future',
    priority: 'high',
    quarter: 'Q3 2025',
    category: 'ux',
    votes: 412
  }
];

const statusConfig = {
  completed: {
    label: 'Completado',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
    iconColor: 'text-green-600'
  },
  'in-progress': {
    label: 'En Desarrollo',
    icon: Zap,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    iconColor: 'text-blue-600'
  },
  planned: {
    label: 'Planificado',
    icon: Calendar,
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    iconColor: 'text-orange-600'
  },
  future: {
    label: 'Futuro',
    icon: Clock,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    iconColor: 'text-gray-600'
  }
};

const categoryConfig = {
  core: { label: 'Core', color: 'bg-vino text-white' },
  integrations: { label: 'Integraciones', color: 'bg-blue-600 text-white' },
  ai: { label: 'IA', color: 'bg-purple-600 text-white' },
  ux: { label: 'UX/UI', color: 'bg-green-600 text-white' },
  enterprise: { label: 'Enterprise', color: 'bg-gray-600 text-white' }
};

const Roadmap: React.FC = () => {
  // SEO optimization for Roadmap page
  useSEO({
    title: 'Roadmap de Lautaro - Plan de Desarrollo y Nuevas Funciones 2025',
    description: 'Mirá el roadmap completo de Lautaro: funciones completadas, en desarrollo y planificadas. Google Calendar, transcripción de audio, Gmail, app móvil y más.',
    keywords: 'roadmap lautaro, desarrollo asistente digital, nuevas funciones IA, google calendar, transcripción audio, gmail integración, app móvil, planificación 2025',
    type: 'website',
    image: 'https://lautaro-te-chamuyo.vercel.app/og-roadmap.jpg'
  });

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filteredItems = roadmapData.filter(item => {
    if (selectedFilter && item.status !== selectedFilter) return false;
    return true;
  });

  const groupedByQuarter = filteredItems.reduce((groups, item) => {
    if (!groups[item.quarter]) {
      groups[item.quarter] = [];
    }
    groups[item.quarter].push(item);
    return groups;
  }, {} as Record<string, RoadmapItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-sand to-[#ffd6c0] dark:from-[#201016] dark:to-[#442134]">
      {/* Header */}
      <section className="w-full bg-gradient-to-r from-vino to-terracota py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white font-quicksand drop-shadow-lg">
            🗺️ Roadmap de Lautaro
          </h1>
          <p className="text-xl text-white/95 max-w-3xl mx-auto leading-relaxed mb-6">
            Mirá lo que viene, lo que estamos construyendo y lo que ya funciona. Tu feedback importa para definir prioridades.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Filtros:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedFilter(null)}
              variant={selectedFilter === null ? "default" : "outline"}
              size="sm"
              className="text-xs"
            >
              Todos
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <Button
                key={status}
                onClick={() => setSelectedFilter(selectedFilter === status ? null : status)}
                variant={selectedFilter === status ? "default" : "outline"}
                size="sm"
                className="text-xs"
              >
                <config.icon className="w-3 h-3 mr-1" />
                {config.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-12">
          {Object.entries(groupedByQuarter).map(([quarter, items]) => (
            <div key={quarter} className="relative">
              {/* Quarter Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg border-2 border-vino">
                  <h2 className="text-xl font-bold text-vino dark:text-beige">
                    {quarter}
                  </h2>
                </div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-vino to-transparent"></div>
              </div>

              {/* Items Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const statusInfo = statusConfig[item.status];
                  const categoryInfo = categoryConfig[item.category];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-5 h-5 ${statusInfo.iconColor}`} />
                          <Badge className={`text-xs ${statusInfo.color}`}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <Badge className={`text-xs ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </Badge>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-vino transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Star className="w-4 h-4" />
                          <span>{item.votes} votos</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-vino group-hover:text-terracota transition-colors">
                          <span>Ver más</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <Users className="w-12 h-12 text-vino mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Tu opinión importa
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              ¿Hay alguna función que te gustaría ver? ¿Tenés ideas para mejorar Lautaro? 
              Contanos y ayudanos a construir el asistente perfecto para vos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-vino hover:bg-vino/90 text-white px-6 py-3"
              >
                <a href="/contacto">
                  💡 Sugerir Función
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-vino text-vino hover:bg-vino hover:text-white px-6 py-3"
              >
                <a href="/chat">
                  💬 Hablar con Lautaro
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap; 