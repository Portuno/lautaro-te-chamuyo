import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MessageCircle, Calendar, Brain, Sparkles, ArrowRight } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import PersonalizedWelcome from '../components/PersonalizedWelcome';
import NewsletterSubscription from '../components/NewsletterSubscription';

const Index = () => {
  const { isAuthenticated, profile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const handleShowRegister = () => {
    setAuthModalTab('register');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-beige via-sand to-vino/10">
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Personalized Welcome for authenticated users */}
          {isAuthenticated && (
            <div className="mb-16">
              <PersonalizedWelcome />
            </div>
          )}

          {/* Hero Section - Always visible */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            {!isAuthenticated ? (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-vino mb-6 font-quicksand">
                  Tu asistente con alma
                </h1>
                <p className="text-lg sm:text-xl text-vino/80 mb-8 leading-relaxed">
                  Lautaro es un carismático asistente hecho para para acompañarte, organizarte y hacerte sonreír.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleShowRegister}
                    className="bg-gradient-to-r from-coral to-vino text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Conocé a Lautaro
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </button>
                  <Link
                    to="/chat"
                    className="border-2 border-vino text-vino px-8 py-4 rounded-xl font-semibold text-lg hover:bg-vino hover:text-white transition-all duration-200 text-center"
                  >
                    Probar sin registro
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl font-bold text-vino mb-4 font-quicksand">
                  ¿Qué quieres hacer hoy?
                </h1>
                <p className="text-lg text-vino/80 mb-8">
                  Explora todas las funciones de Lautaro y descubre nuevas formas de interactuar.
                </p>
              </>
            )}
          </div>

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
