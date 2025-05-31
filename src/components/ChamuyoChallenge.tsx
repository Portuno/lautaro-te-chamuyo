import React, { useState } from "react";
import { Target, Clock, Users, Award, Sparkles, Code, Briefcase, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Challenge {
  id: string;
  titulo: string;
  descripcion: string;
  tema: string;
  palabraClave: string;
  icono: React.ReactNode;
  premio: string;
  participantes: number;
  diasRestantes: number;
  ejemplos: string[];
  dificultad: 'fácil' | 'medio' | 'difícil';
}

interface ChamuyoChallengeProps {
  onAcceptChallenge: (palabraClave: string) => void;
}

const CHALLENGES_DISPONIBLES: Challenge[] = [
  {
    id: "geek",
    titulo: "Chamuyo Geek 🤓",
    descripcion: "Creá frases románticas usando terminología tecnológica",
    tema: "Tecnología y amor",
    palabraClave: "código",
    icono: <Code className="w-5 h-5" />,
    premio: "Insignia 'Hacker del Corazón'",
    participantes: 47,
    diasRestantes: 3,
    ejemplos: [
      "Sos el commit perfecto en el repositorio de mi corazón",
      "No necesito debug cuando estás conmigo, todo funciona perfecto"
    ],
    dificultad: 'medio'
  },
  {
    id: "oficina",
    titulo: "Chamuyo de Oficina 💼",
    descripcion: "Frases que podrías usar en el trabajo (con cuidado)",
    tema: "Ambiente laboral",
    palabraClave: "reunión",
    icono: <Briefcase className="w-5 h-5" />,
    premio: "Insignia 'CEO del Corazón'",
    participantes: 32,
    diasRestantes: 5,
    ejemplos: [
      "¿Podemos agendar una reunión permanente en mi vida?",
      "Tu sonrisa es más efectiva que cualquier team building"
    ],
    dificultad: 'fácil'
  },
  {
    id: "emoji",
    titulo: "Chamuyo en Código 🔐",
    descripcion: "Expresá tu chamuyo solo con emojis y símbolos",
    tema: "Comunicación visual",
    palabraClave: "emoji",
    icono: <Sparkles className="w-5 h-5" />,
    premio: "Insignia 'Maestro del Emoji'",
    participantes: 23,
    diasRestantes: 2,
    ejemplos: [
      "👀➡️💖 = 🔥🌟",
      "🌅+☕+👤 = 😍💯"
    ],
    dificultad: 'difícil'
  },
  {
    id: "nostalgico",
    titulo: "Chamuyo Nostálgico 📼",
    descripcion: "Frases que podrían haber sido de los 90s o 2000s",
    tema: "Nostalgia",
    palabraClave: "cassette",
    icono: <Heart className="w-5 h-5" />,
    premio: "Insignia 'Vintage Heart'",
    participantes: 18,
    diasRestantes: 6,
    ejemplos: [
      "Sos mi canción favorita en repeat en mi discman",
      "Te escribiría cartas de amor, pero ya no hay locutorios"
    ],
    dificultad: 'medio'
  }
];

const ChamuyoChallenge = ({ onAcceptChallenge }: ChamuyoChallengeProps) => {
  const [challengeActivo, setChallengeActivo] = useState<Challenge>(CHALLENGES_DISPONIBLES[0]);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const getDificultadColor = (dificultad: string) => {
    switch (dificultad) {
      case 'fácil': return 'bg-green-100 text-green-700';
      case 'medio': return 'bg-yellow-100 text-yellow-700';
      case 'difícil': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAcceptChallenge = (challenge: Challenge) => {
    onAcceptChallenge(challenge.palabraClave);
  };

  return (
    <div className="space-y-6">
      {/* Challenge Principal */}
      <Card className="bg-gradient-to-r from-terracota/20 to-coral/20 border-terracota/30 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-terracota/20 rounded-full flex items-center justify-center flex-shrink-0">
              {challengeActivo.icono}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-vino font-quicksand">
                  🎯 {challengeActivo.titulo}
                </h3>
                <Badge className={getDificultadColor(challengeActivo.dificultad)}>
                  {challengeActivo.dificultad}
                </Badge>
              </div>
              
              <p className="text-vino/80 mb-4">{challengeActivo.descripcion}</p>
              
              {/* Stats del challenge */}
              <div className="flex items-center gap-6 text-sm text-vino/70 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{challengeActivo.participantes} participantes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{challengeActivo.diasRestantes} días restantes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>{challengeActivo.premio}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-vino/60">Progreso semanal</span>
                  <span className="text-vino/60">{Math.round((7 - challengeActivo.diasRestantes) / 7 * 100)}%</span>
                </div>
                <Progress 
                  value={(7 - challengeActivo.diasRestantes) / 7 * 100} 
                  className="h-2"
                />
              </div>

              {/* Ejemplos */}
              <div className="mb-4">
                <h4 className="font-semibold text-vino text-sm mb-2">💡 Ejemplos inspiradores:</h4>
                <div className="space-y-2">
                  {challengeActivo.ejemplos.map((ejemplo, index) => (
                    <div key={index} className="bg-vino/5 rounded-lg p-3 border border-vino/10">
                      <p className="text-sm text-vino italic">"{ejemplo}"</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => handleAcceptChallenge(challengeActivo)}
                  className="bg-terracota hover:bg-vino text-beige font-quicksand"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Aceptar Desafío
                </Button>
                
                <Button 
                  onClick={() => setMostrarTodos(!mostrarTodos)}
                  variant="outline"
                  className="border-terracota text-terracota hover:bg-terracota/10"
                >
                  {mostrarTodos ? 'Ocultar otros' : 'Ver otros desafíos'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Otros desafíos */}
      {mostrarTodos && (
        <div className="grid md:grid-cols-2 gap-4">
          {CHALLENGES_DISPONIBLES.filter(c => c.id !== challengeActivo.id).map((challenge) => (
            <Card key={challenge.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {challenge.icono}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-vino text-sm">{challenge.titulo}</h4>
                      <Badge className={`${getDificultadColor(challenge.dificultad)} text-xs`}>
                        {challenge.dificultad}
                      </Badge>
                    </div>
                    
                    <p className="text-vino/70 text-sm mb-3">{challenge.descripcion}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-vino/60">
                        {challenge.participantes} participantes
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => setChallengeActivo(challenge)}
                          variant="outline"
                          className="text-xs"
                        >
                          Ver detalles
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAcceptChallenge(challenge)}
                          className="bg-coral hover:bg-coral/80 text-white text-xs"
                        >
                          Aceptar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Historiales de challenges anteriores */}
      <Card className="bg-beige/30 border-sand/40">
        <CardContent className="p-4">
          <h4 className="font-semibold text-vino text-sm mb-3">🏆 Challenges anteriores</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-vino/70">Chamuyo Navideño 🎄</span>
              <Badge className="bg-green-100 text-green-700">Completado</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-vino/70">Frases de Invierno ❄️</span>
              <Badge className="bg-blue-100 text-blue-700">89 participantes</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-vino/70">Chamuyo Fitness 💪</span>
              <Badge className="bg-purple-100 text-purple-700">156 frases</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChamuyoChallenge; 