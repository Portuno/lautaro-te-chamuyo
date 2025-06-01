
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MessageCircle, Calendar, Brain, Sparkles, ArrowRight, User, LogOut, Menu, X } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import PersonalizedWelcome from '../components/PersonalizedWelcome';

const Index = () => {
  const { isAuthenticated, user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleShowLogin = () => {
    setAuthModalTab('login');
    setShowAuthModal(true);
  };

  const handleShowRegister = () => {
    setAuthModalTab('register');
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Debug information
  React.useEffect(() => {
    console.log('🧭 Navigation Debug:', {
      isAuthenticated,
      user: user?.email,
      profile: profile?.preferred_name || profile?.full_name
    });
    
    // TEST: Add an alert to verify changes are loading
    console.log('🔥 TEST: Index.tsx loaded with changes!');
    // Uncomment this line to test if changes are loading:
    // alert('TEST: Changes are loading!');
  }, [isAuthenticated, user, profile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-sand to-vino/10">
      {/* Navigation - Always visible */}
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-vino" />
            <span className="text-xl sm:text-2xl font-bold text-vino font-quicksand">Laubot</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Always show main navigation links */}
            <Link 
              to="/chat" 
              className="text-vino hover:bg-vino/10 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Chat
            </Link>
            <Link 
              to="/laboratorio" 
              className="text-vino hover:bg-vino/10 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Laboratorio
            </Link>
            <Link 
              to="/dashboard" 
              className="text-vino hover:bg-vino/10 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Dashboard
            </Link>
            
            {isAuthenticated ? (
              <>
                <span className="text-vino/70 text-sm border-l border-vino/20 pl-4">
                  Hola, {profile?.preferred_name || profile?.full_name || user?.email?.split('@')[0]}!
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 text-vino hover:bg-vino/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleShowLogin}
                  className="text-vino hover:text-vino/80 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-vino/10"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={handleShowRegister}
                  className="bg-vino text-white px-6 py-2 rounded-lg hover:bg-vino/90 transition-colors font-medium"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-vino p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-vino/20">
            <div className="space-y-3">
              {/* Always show main navigation links in mobile */}
              <Link 
                to="/chat" 
                className="block w-full px-4 py-3 text-vino hover:bg-vino/10 rounded-lg transition-colors text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Chat
              </Link>
              <Link 
                to="/laboratorio" 
                className="block w-full px-4 py-3 text-vino hover:bg-vino/10 rounded-lg transition-colors text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Laboratorio
              </Link>
              <Link 
                to="/dashboard" 
                className="block w-full px-4 py-3 text-vino hover:bg-vino/10 rounded-lg transition-colors text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              
              {isAuthenticated ? (
                <>
                  <div className="text-vino/70 text-sm py-3 border-t border-vino/20 text-center">
                    {profile?.preferred_name || profile?.full_name || user?.email?.split('@')[0]}
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 text-vino hover:bg-vino/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-vino/20 pt-3">
                    <button
                      onClick={() => {
                        handleShowLogin();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full px-4 py-3 text-vino hover:bg-vino/10 rounded-lg transition-colors text-center"
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => {
                        handleShowRegister();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full px-4 py-3 bg-vino text-white rounded-lg hover:bg-vino/90 transition-colors text-center mt-2"
                    >
                      Registrarse
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

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
                  Más que un chat, es una conexión. Lautaro combina inteligencia artificial 
                  con carisma argentino para acompañarte, organizarte y hacerte sonreír.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <Link 
              to="/chat"
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 group border border-white/40 cursor-pointer"
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
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 group border border-white/40 cursor-pointer"
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
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 group border border-white/40 cursor-pointer"
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

          {/* CTA Section - Show for non-authenticated users */}
          {!isAuthenticated && (
            <div className="text-center bg-gradient-to-r from-coral/20 to-vino/20 rounded-3xl p-12 border border-coral/30">
              <h2 className="text-3xl font-bold text-vino mb-6 font-quicksand">
                ¿Listo para una experiencia diferente?
              </h2>
              <p className="text-lg text-vino/80 mb-8 max-w-2xl mx-auto">
                Registrate gratis y descubrí por qué miles de personas eligen a Lautaro 
                como su compañero digital favorito.
              </p>
              <button
                onClick={handleShowRegister}
                className="bg-gradient-to-r from-coral to-vino text-white px-10 py-4 rounded-xl font-semibold text-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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
