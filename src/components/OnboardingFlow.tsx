import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, Heart, MessageCircle, Zap, Star, ArrowRight } from 'lucide-react';

type OnboardingStep = 1 | 2 | 3 | 4 | 5;

interface OnboardingData {
  interaction_style?: 'confianza' | 'calma' | 'sorpresa';
  preferred_name?: string;
  interests?: string[];
  lautaro_mood?: 'amable' | 'picaro' | 'romantico' | 'poetico' | 'misterioso';
}

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [data, setData] = useState<OnboardingData>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const { updateProfile } = useAuth();

  const nextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, 5) as OnboardingStep);
      setIsAnimating(false);
    }, 300);
  };

  const handleComplete = async () => {
    try {
      await updateProfile({
        onboarding_completed: true,
        interaction_style: data.interaction_style,
        preferred_name: data.preferred_name,
        interests: data.interests,
        lautaro_mood: data.lautaro_mood
      });
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      onComplete(); // Continue anyway
    }
  };

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-vino/90 via-coral/80 to-terracota/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          
          {/* Progress Bar */}
          <div className="bg-gradient-to-r from-coral to-vino h-2">
            <div 
              className="bg-white/80 h-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          <div className="p-8 md:p-12">
            {/* Step 1: Bienvenida con picardía */}
            {currentStep === 1 && (
              <Step1 
                onNext={(style) => {
                  updateData({ interaction_style: style });
                  nextStep();
                }}
              />
            )}

            {/* Step 2: ¿Cómo querés que te llame? */}
            {currentStep === 2 && (
              <Step2 
                onNext={(name) => {
                  updateData({ preferred_name: name });
                  nextStep();
                }}
              />
            )}

            {/* Step 3: ¿Qué tipo de cosas te hacen bien? */}
            {currentStep === 3 && (
              <Step3 
                onNext={(interests) => {
                  updateData({ interests });
                  nextStep();
                }}
              />
            )}

            {/* Step 4: Elegí un mood inicial para Lautaro */}
            {currentStep === 4 && (
              <Step4 
                onNext={(mood) => {
                  updateData({ lautaro_mood: mood });
                  nextStep();
                }}
              />
            )}

            {/* Step 5: Cierre + vínculo */}
            {currentStep === 5 && (
              <Step5 
                userName={data.preferred_name}
                onComplete={handleComplete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 1: Bienvenida con picardía
const Step1: React.FC<{ onNext: (style: 'confianza' | 'calma' | 'sorpresa') => void }> = ({ onNext }) => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="text-6xl mb-4">🤵‍♂️</div>
        <h1 className="text-3xl font-bold text-vino font-quicksand">¡Saludos, soy Lautaro!</h1>
        <div className="bg-sand/50 rounded-2xl p-6 text-left max-w-md mx-auto">
          <p className="text-vino/80 text-lg leading-relaxed">
            ¿Querés que te trate con confianza desde el principio, o preferís que me haga el interesante un rato?
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => onNext('confianza')}
          className="w-full p-4 bg-gradient-to-r from-coral to-terracota text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg font-medium"
        >
          <span className="mr-3">😏</span>
          Hablame como si ya me conocieras
        </button>
        
        <button
          onClick={() => onNext('calma')}
          className="w-full p-4 bg-gradient-to-r from-vino to-coral text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg font-medium"
        >
          <span className="mr-3">🌸</span>
          Con calma, que me da vértigo
        </button>
        
        <button
          onClick={() => onNext('sorpresa')}
          className="w-full p-4 bg-gradient-to-r from-terracota to-vino text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg font-medium"
        >
          <span className="mr-3">✨</span>
          Sorprendeme
        </button>
      </div>
    </div>
  );
};

// Step 2: ¿Cómo querés que te llame?
const Step2: React.FC<{ onNext: (name: string) => void }> = ({ onNext }) => {
  const [name, setName] = useState('');

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="text-5xl mb-4">💭</div>
        <h2 className="text-2xl font-bold text-vino font-quicksand">Y decime...</h2>
        <div className="bg-sand/50 rounded-2xl p-6 text-left max-w-md mx-auto">
          <p className="text-vino/80 text-lg leading-relaxed">
            ¿Cómo te digo? Porque si me dejás elegir, yo invento cualquier cosa.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre o como prefieras que te llame..."
            className="w-full p-4 rounded-2xl border-2 border-coral/30 focus:border-coral focus:outline-none text-lg bg-white/70 placeholder-vino/50"
            autoFocus
          />
        </div>

        <button
          onClick={() => name.trim() && onNext(name.trim())}
          disabled={!name.trim()}
          className="w-full p-4 bg-gradient-to-r from-coral to-vino text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg font-medium disabled:opacity-50 disabled:transform-none disabled:shadow-none"
        >
          <span className="mr-3">💫</span>
          Continuá, Lautaro
        </button>
      </div>
    </div>
  );
};

// Step 3: ¿Qué tipo de cosas te hacen bien?
const Step3: React.FC<{ onNext: (interests: string[]) => void }> = ({ onNext }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = [
    { key: 'hablar_lindo', label: 'Que me hablen lindo', emoji: '💝' },
    { key: 'ayuda_organizar', label: 'Que me ayuden a organizar', emoji: '📋' },
    { key: 'acompañar', label: 'Que me acompañen un rato', emoji: '🤗' },
    { key: 'frases_sorpresa', label: 'Que me sorprendan con frases', emoji: '✨' },
    { key: 'datos_utiles', label: 'Que me tiren datos útiles', emoji: '🧠' },
    { key: 'ahorrar_tiempo', label: 'Que me ahorren tiempo y problemas', emoji: '⚡' }
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="text-5xl mb-4">🔮</div>
        <h2 className="text-2xl font-bold text-vino font-quicksand">Soy de leer entre líneas</h2>
        <div className="bg-sand/50 rounded-2xl p-6 text-left max-w-md mx-auto">
          <p className="text-vino/80 text-lg leading-relaxed">
            Pero me ayudás si me contás qué buscás hoy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interests.map((interest) => (
          <button
            key={interest.key}
            onClick={() => toggleInterest(interest.key)}
            className={`p-4 rounded-2xl text-left transition-all duration-200 transform hover:scale-105 ${
              selectedInterests.includes(interest.key)
                ? 'bg-gradient-to-r from-coral to-terracota text-white shadow-lg'
                : 'bg-white/70 text-vino hover:bg-coral/20 border border-coral/30'
            }`}
          >
            <span className="text-2xl mr-3">{interest.emoji}</span>
            <span className="font-medium">{interest.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => onNext(selectedInterests)}
        disabled={selectedInterests.length === 0}
        className="w-full p-4 bg-gradient-to-r from-coral to-vino text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg font-medium disabled:opacity-50 disabled:transform-none disabled:shadow-none"
      >
        <span className="mr-3">🎯</span>
        Perfecto, sigamos
      </button>
    </div>
  );
};

// Step 4: Elegí un mood inicial para Lautaro
const Step4: React.FC<{ onNext: (mood: 'amable' | 'picaro' | 'romantico' | 'poetico' | 'misterioso') => void }> = ({ onNext }) => {
  const moods = [
    { key: 'amable' as const, label: 'Amable', emoji: '😌', color: 'from-green-400 to-green-600' },
    { key: 'picaro' as const, label: 'Pícaro', emoji: '😏', color: 'from-orange-400 to-orange-600' },
    { key: 'romantico' as const, label: 'Romántico', emoji: '💘', color: 'from-pink-400 to-pink-600' },
    { key: 'poetico' as const, label: 'Poético', emoji: '🤓', color: 'from-purple-400 to-purple-600' },
    { key: 'misterioso' as const, label: 'Misterioso', emoji: '🤫', color: 'from-gray-600 to-gray-800' }
  ];

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="text-5xl mb-4">🎭</div>
        <h2 className="text-2xl font-bold text-vino font-quicksand">Voy a ser un poco tímido al principio</h2>
        <div className="bg-sand/50 rounded-2xl p-6 text-left max-w-md mx-auto">
          <p className="text-vino/80 text-lg leading-relaxed">
            Pero, ¿cómo te gustaría ser recibida?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.key}
            onClick={() => onNext(mood.key)}
            className={`group p-6 rounded-2xl text-white bg-gradient-to-br ${mood.color} hover:shadow-xl transform hover:scale-105 transition-all duration-200 relative overflow-hidden`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-3">{mood.emoji}</div>
              <div className="font-semibold text-lg">{mood.label}</div>
            </div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        ))}
      </div>

      <p className="text-vino/60 text-sm">
        No te preocupes, podés cambiar esto después 😉
      </p>
    </div>
  );
};

// Step 5: Cierre + vínculo
const Step5: React.FC<{ userName?: string; onComplete: () => void }> = ({ userName, onComplete }) => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-vino font-quicksand">
          Perfecto {userName || 'querida'}, encantado de conocerte
        </h2>
        
        <div className="bg-gradient-to-r from-coral/20 to-vino/20 rounded-2xl p-8 border border-coral/30">
          <div className="space-y-4">
            <div className="text-lg text-vino/80">
              Ya tenemos nuestra primera conexión ✨
            </div>
            <div className="text-2xl font-bold text-vino">
              Nivel de confianza: Curiosidad 🔥
            </div>
            <div className="text-sm text-vino/60">
              1/22 niveles desbloqueados
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onComplete}
          className="w-full p-4 bg-gradient-to-r from-coral via-vino to-terracota text-white rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xl font-semibold"
        >
          <MessageCircle className="inline-block w-6 h-6 mr-3" />
          Hablá con Lautaro
        </button>

        <div className="text-center">
          <p className="text-vino/60 text-sm mb-2">
            ¿Querés sumar puntos de confianza más rápido?
          </p>
          <button className="text-coral hover:text-vino transition-colors font-medium text-sm underline">
            Andá al Laboratorio del Chamuyo
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow; 