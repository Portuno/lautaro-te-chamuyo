import React from "react";
import { Trophy, Medal, Star, TrendingUp, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserStats {
  nombre: string;
  puntos: number;
  frasesCreadas: number;
  reaccionesTotales: number;
  nivel: string;
  insignias: string[];
  posicion: number;
}

interface UserRankingSystemProps {
  usuarios: UserStats[];
  currentUser?: string;
}

const NIVELES_CHAMUYO = [
  { min: 0, max: 99, nombre: "Aprendiz de Chamuyo", color: "bg-gray-100 text-gray-700", emoji: "🌱" },
  { min: 100, max: 299, nombre: "Chamuyero Novato", color: "bg-blue-100 text-blue-700", emoji: "🗣️" },
  { min: 300, max: 599, nombre: "Maestro del Verso", color: "bg-purple-100 text-purple-700", emoji: "🎭" },
  { min: 600, max: 999, nombre: "Poeta del Corazón", color: "bg-pink-100 text-pink-700", emoji: "💕" },
  { min: 1000, max: 1999, nombre: "Leyenda Viviente", color: "bg-orange-100 text-orange-700", emoji: "🔥" },
  { min: 2000, max: Infinity, nombre: "Dios del Chamuyo", color: "bg-yellow-100 text-yellow-700", emoji: "👑" }
];

const INSIGNIAS_DISPONIBLES = [
  { id: "primera_frase", nombre: "Primera Frase", emoji: "🎯", descripcion: "Publicó su primera frase" },
  { id: "viral", nombre: "Viral", emoji: "🚀", descripcion: "Frase con +100 reacciones" },
  { id: "maestro_tierno", nombre: "Maestro Tierno", emoji: "🥰", descripcion: "Especialista en frases tiernas" },
  { id: "picaro_profesional", nombre: "Pícaro Profesional", emoji: "😏", descripcion: "Expert en chamuyo pícaro" },
  { id: "filosofo", nombre: "Filósofo", emoji: "🤔", descripción: "Maestro de frases existenciales" },
  { id: "consistente", nombre: "Consistente", emoji: "📈", descripcion: "5 días seguidos publicando" },
  { id: "popular", nombre: "Popular", emoji: "⭐", descripcion: "Top 3 del ranking" }
];

const UserRankingSystem = ({ usuarios, currentUser }: UserRankingSystemProps) => {
  const getNivelInfo = (puntos: number) => {
    return NIVELES_CHAMUYO.find(nivel => puntos >= nivel.min && puntos <= nivel.max) || NIVELES_CHAMUYO[0];
  };

  const getPosicionIcon = (posicion: number) => {
    switch (posicion) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{posicion}</span>;
    }
  };

  const getInsignia = (insigniaId: string) => {
    return INSIGNIAS_DISPONIBLES.find(i => i.id === insigniaId);
  };

  return (
    <Card className="bg-gradient-to-br from-vino/5 to-terracota/5 border-vino/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-vino" />
          <h3 className="text-xl font-bold text-vino font-quicksand">🏆 Ranking de Chamuyeros</h3>
        </div>

        <div className="space-y-4">
          {usuarios.slice(0, 10).map((usuario, index) => {
            const nivelInfo = getNivelInfo(usuario.puntos);
            const esUsuarioActual = currentUser === usuario.nombre;
            
            return (
              <div
                key={usuario.nombre}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  esUsuarioActual 
                    ? 'bg-coral/20 border-2 border-coral/40 shadow-md' 
                    : 'bg-white/50 hover:bg-white/80'
                } ${index < 3 ? 'ring-2 ring-yellow-200' : ''}`}
              >
                {/* Posición */}
                <div className="flex-shrink-0">
                  {getPosicionIcon(usuario.posicion)}
                </div>

                {/* Avatar y nombre */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-vino">
                      {usuario.nombre}
                      {esUsuarioActual && <span className="text-coral ml-1">(Tú)</span>}
                    </span>
                    
                    {/* Insignias */}
                    <div className="flex gap-1">
                      {usuario.insignias.slice(0, 3).map((insigniaId) => {
                        const insignia = getInsignia(insigniaId);
                        return insignia ? (
                          <span 
                            key={insigniaId}
                            title={insignia.descripcion}
                            className="text-sm"
                          >
                            {insignia.emoji}
                          </span>
                        ) : null;
                      })}
                      {usuario.insignias.length > 3 && (
                        <span className="text-xs text-gray-500">+{usuario.insignias.length - 3}</span>
                      )}
                    </div>
                  </div>

                  {/* Nivel */}
                  <Badge className={`${nivelInfo.color} text-xs`}>
                    {nivelInfo.emoji} {nivelInfo.nombre}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="text-right text-sm">
                  <div className="font-bold text-vino">{usuario.puntos} pts</div>
                  <div className="text-vino/60 text-xs">
                    {usuario.frasesCreadas} frases • {usuario.reaccionesTotales} ❤️
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Como funciona el ranking */}
        <div className="mt-6 p-4 bg-beige/50 rounded-lg border border-sand/40">
          <h4 className="font-semibold text-vino text-sm mb-2">💡 ¿Cómo se calculan los puntos?</h4>
          <div className="text-xs text-vino/70 space-y-1">
            <div>• Publicar frase: <span className="font-semibold">+10 puntos</span></div>
            <div>• Cada reacción ❤️: <span className="font-semibold">+2 puntos</span></div>
            <div>• Cada reacción 🔥: <span className="font-semibold">+3 puntos</span></div>
            <div>• Frase destacada: <span className="font-semibold">+50 puntos</span></div>
            <div>• Completar desafío: <span className="font-semibold">+25 puntos</span></div>
          </div>
        </div>

        {/* Current user progress */}
        {currentUser && (
          <div className="mt-4 p-4 bg-coral/10 rounded-lg border border-coral/20">
            <h4 className="font-semibold text-vino text-sm mb-2">📊 Tu Progreso</h4>
            <div className="text-xs text-vino/70">
              Próximo nivel: Necesitás {getNivelInfo(usuarios.find(u => u.nombre === currentUser)?.puntos || 0).max + 1} puntos
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRankingSystem; 