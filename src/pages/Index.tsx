import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSEO } from '../hooks/useSEO';
import { MessageCircle, Calendar, Brain, Sparkles, ArrowRight } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import PersonalizedWelcome from '../components/PersonalizedWelcome';
import NewsletterSubscription from '../components/NewsletterSubscription';
import LaubotExample from '../components/LaubotExample';

const Index = () => {
  const { isAuthenticated, profile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // SEO optimization
  useSEO({
    title: 'Lautaro - Tu Asistente Digital con Onda Porteña | IA Argentina',
    description: 'Conocé a Lautaro, tu asistente digital con inteligencia artificial y personalidad argentina. Gestiona tu calendario, transcribe audios, ayuda con tareas diarias y más. ¡Empezá gratis ahora!',
    keywords: 'asistente digital, inteligencia artificial argentina, IA, chatbot argentino, automatización, calendario, transcripción, productividad, Buenos Aires, asistente virtual',
    type: 'website',
    image: 'https://lautaro-te-chamuyo.vercel.app/og-home.jpg'
  });

  const handleShowRegister = () => {
    setAuthModalTab('register');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige to-sand">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-vino/10 to-coral/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-vino mb-6 font-quicksand">
              Conocé a <span className="text-coral">Lautaro</span>
            </h1>
            <p className="text-xl md:text-2xl text-vino/80 mb-8 max-w-3xl mx-auto">
              Tu asistente digital con inteligencia artificial y onda porteña.
              Te ayuda con todo lo que necesites, desde gestionar tu agenda hasta transcribir audios.
            </p>
            
            {/* Personalized Welcome */}
            <PersonalizedWelcome />
            
            {/* Features highlight */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">📅</div>
                <h3 className="font-semibold text-vino">Calendario</h3>
                <p className="text-sm text-vino/70">Gestión inteligente</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🎤</div>
                <h3 className="font-semibold text-vino">Transcripción</h3>
                <p className="text-sm text-vino/70">Audios a texto</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold text-vino">Chat IA</h3>
                <p className="text-sm text-vino/70">Conversación natural</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🚀</div>
                <h3 className="font-semibold text-vino">Automatización</h3>
                <p className="text-sm text-vino/70">Tareas repetitivas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-vino mb-4">
              Probá Lautaro en acción
            </h2>
            <p className="text-xl text-vino/80">
              Hacé clic en los ejemplos y mirá cómo Lautaro puede ayudarte
            </p>
          </div>
          
          <LaubotExample />
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-vino mb-4">
              ¿Por qué elegir Lautaro?
            </h2>
            <p className="text-xl text-vino/80 max-w-3xl mx-auto">
              No es solo un chatbot más. Es tu compañero digital que entiende el contexto argentino
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🇦🇷</div>
              <h3 className="text-xl font-bold text-vino mb-3">100% Argentino</h3>
              <p className="text-vino/70">
                Entiende nuestro idioma, cultura y forma de trabajar. 
                Desde el "che" hasta los horarios locales.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-vino mb-3">Inteligencia Avanzada</h3>
              <p className="text-vino/70">
                Powered by los mejores modelos de IA, pero con personalidad y calidez humana.
                No es frío ni robótico.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-vino mb-3">Siempre Disponible</h3>
              <p className="text-vino/70">
                24/7 listo para ayudarte. Desde temprano hasta tarde, 
                Lautaro está cuando lo necesites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-vino to-terracota">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSubscription />
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Features Grid - Always visible */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-16">
            <Link 
              to="/chat"
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-300 group border border-white/40 cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-coral to-terracota rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-vino mb-4 font-quicksand">Chat Inteligente</h3>
              <p className="text-vino/70 leading-relaxed">
                Conversaciones naturales con personalidad única. Lautaro se adapta a tu estilo y preferencias.
              </p>
            </Link>

            <Link 
              to="/laboratorio"
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-300 group border border-white/40 cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-vino to-coral rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-vino mb-4 font-quicksand">Laboratorio de Chamuyo</h3>
              <p className="text-vino/70 leading-relaxed">
                Practica conversaciones, mejora tu carisma y desbloquea niveles de confianza únicos.
              </p>
            </Link>

            <Link 
              to="/dashboard"
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-300 group border border-white/40 cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-terracota to-vino rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-vino mb-4 font-quicksand">Dashboard Personal</h3>
              <p className="text-vino/70 leading-relaxed">
                Gestión de calendario, recordatorios y ayuda para organizar tu vida con estilo.
              </p>
            </Link>
          </div>

          {/* Newsletter Section - Always visible */}
          <div className="mb-16">
            <NewsletterSubscription 
              sourcePage="home"
              className="max-w-2xl mx-auto"
              title="¡Mantente al día con Lautaro!"
              description="Recibe las últimas actualizaciones, nuevas funciones y consejos exclusivos directamente en tu email."
            />
          </div>

          {/* CTA Section - Show for non-authenticated users */}
          {!isAuthenticated && (
            <div className="text-center bg-gradient-to-r from-coral/20 to-vino/20 rounded-3xl p-8 sm:p-12 border border-coral/30">
              <h2 className="text-2xl sm:text-3xl font-bold text-vino mb-6 font-quicksand">
                ¿Listo para una experiencia diferente?
              </h2>
              <p className="text-base sm:text-lg text-vino/80 mb-8 max-w-2xl mx-auto">
                Registrate gratis y descubrí por qué miles de personas eligen a Lautaro 
                como su compañero digital favorito.
              </p>
              <button
                onClick={handleShowRegister}
                className="bg-gradient-to-r from-coral to-vino text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold text-lg sm:text-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Empezar ahora
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
      />
    </div>
  );
};

export default Index;
