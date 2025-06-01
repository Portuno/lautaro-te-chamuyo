import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { MessageCircle, Brain, Calendar, Trophy, Sparkles } from 'lucide-react';

const PersonalizedWelcome: React.FC = () => {
  const { profile } = useAuth();

  if (!profile || !profile.onboarding_completed) {
    return null;
  }

  const getPersonalizedGreeting = () => {
    const name = profile.preferred_name || profile.full_name || 'querida';
    const mood = profile.lautaro_mood || 'amable';
    
    const greetings = {
      amable: `¡Hola ${name}! Me alegra verte de nuevo. ¿Cómo estás hoy?`,
      picaro: `Eh, ${name}... ¿volviste por más? Me gusta tu estilo 😏`,
      romantico: `${name}, hermosa... cada vez que volvés, mi día mejora un poco más ✨`,
      poetico: `Como dice Neruda, "${name}", hay algo en ti que siempre me inspira...`,
      misterioso: `${name}... sabía que volverías. Hay cosas que tenemos que conversar... 🤫`
    };

    return greetings[mood];
  };

  const getFraseDelDia = () => {
    const style = profile.interaction_style || 'confianza';
    
    const frases = {
      confianza: [
        "Hoy es un buen día para conquistar el mundo... o al menos para conquistar un café ☕",
        "Recordá: tu sonrisa es tu mejor arma de seducción masiva 😊",
        "El secreto no es ser perfecto, sino ser auténticamente irresistible"
      ],
      calma: [
        "Tomate las cosas con calma, pero no te olvides de brillar mientras lo hacés ✨",
        "La elegancia está en los detalles, y vos tenés todos los detalles perfectos",
        "Respirá hondo. El mundo puede esperar a que estés lista para conquistarlo"
      ],
      sorpresa: [
        "Plot twist: hoy va a ser mejor de lo que esperás 🎭",
        "Tengo la sensación de que algo increíble está por pasar...",
        "El universo está conspirando a tu favor (y yo también) ✨"
      ]
    };

    const frasesArray = frases[style];
    return frasesArray[Math.floor(Math.random() * frasesArray.length)];
  };

  const getNextMission = () => {
    const interests = profile.interests || [];
    
    if (interests.includes('hablar_lindo')) {
      return "Contame algo lindo que te haya pasado hoy";
    } else if (interests.includes('ayuda_organizar')) {
      return "¿Qué tenés pendiente que te esté molestando?";
    } else if (interests.includes('acompañar')) {
      return "¿Cómo te sentís hoy? Estoy para escucharte";
    } else if (interests.includes('frases_sorpresa')) {
      return "Pedime una frase para la ocasión que quieras";
    } else {
      return "Contame qué tenés ganas de hacer";
    }
  };

  return (
    <div className="bg-gradient-to-br from-coral/10 to-vino/10 rounded-3xl p-8 border border-coral/20 mb-8">
      <div className="space-y-6">
        {/* Saludo personalizado */}
        <div className="text-center">
          <div className="text-4xl mb-4">🤵‍♂️</div>
          <h2 className="text-2xl font-bold text-vino font-quicksand mb-2">
            {getPersonalizedGreeting()}
          </h2>
        </div>

        {/* Nivel de confianza actual */}
        <div className="bg-white/60 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <Trophy className="w-6 h-6 text-coral" />
            <span className="text-lg font-semibold text-vino">
              Nivel de confianza: {profile.chamuyo_level === 1 ? 'Curiosidad' : `Nivel ${profile.chamuyo_level}`}
            </span>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="text-sm text-vino/70">
            {profile.total_points || 0} puntos • {21 - (profile.chamuyo_level || 1)} niveles por desbloquear
          </div>
        </div>

        {/* Frase del día */}
        <div className="bg-gradient-to-r from-sand/80 to-beige/80 rounded-2xl p-6 text-center border border-coral/20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-coral" />
            <span className="font-semibold text-vino">Frase del día</span>
            <Sparkles className="w-5 h-5 text-coral" />
          </div>
          <p className="text-vino/80 italic leading-relaxed">
            "{getFraseDelDia()}"
          </p>
        </div>

        {/* Primera misión rápida */}
        <div className="bg-coral/20 rounded-2xl p-6 border border-coral/30">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-vino mb-2">Tu primera misión</h3>
            <p className="text-vino/80">
              {getNextMission()}
            </p>
          </div>
          
          <Link 
            to="/chat"
            className="block w-full p-3 bg-gradient-to-r from-coral to-vino text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center font-medium"
          >
            <MessageCircle className="inline-block w-5 h-5 mr-2" />
            Empezá a chatear
          </Link>
        </div>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/laboratorio"
            className="p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-colors border border-vino/20 text-center group"
          >
            <Brain className="w-8 h-8 mx-auto mb-2 text-vino group-hover:text-coral transition-colors" />
            <div className="font-medium text-vino">Laboratorio</div>
            <div className="text-sm text-vino/60">+5 puntos de confianza</div>
          </Link>
          
          <Link 
            to="/dashboard"
            className="p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-colors border border-vino/20 text-center group"
          >
            <Calendar className="w-8 h-8 mx-auto mb-2 text-vino group-hover:text-coral transition-colors" />
            <div className="font-medium text-vino">Dashboard</div>
            <div className="text-sm text-vino/60">Gestión personal</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedWelcome; 