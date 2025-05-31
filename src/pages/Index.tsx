import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MessageCircle, Calendar, Brain, Sparkles, ArrowRight, User, LogOut, Menu, X } from 'lucide-react';
import AuthModal from '../components/AuthModal';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-sand to-vino/10">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-vino" />
            <span className="text-xl sm:text-2xl font-bold text-vino font-quicksand">Laubot</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-vino/70 text-sm">
                  Hola, {profile?.full_name || user?.email?.split('@')[0]}!
                </span>
                <Link 
                  to="/dashboard" 
                  className="flex items-center px-4 py-2 text-vino hover:bg-vino/10 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </Link>
                <Link 
                  to="/chat" 
                  className="px-6 py-2 bg-vino text-white rounded-lg hover:bg-vino/90 transition-colors"
                >
                  Chatear
                </Link>
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
                <Link 
                  to="/chat" 
                  className="px-4 py-2 text-vino hover:bg-vino/10 rounded-lg transition-colors"
                >
                  Probar Chat
                </Link>
                <button 
                  onClick={handleShowLogin}
                  className="px-4 py-2 text-vino hover:bg-vino/10 rounded-lg transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={handleShowRegister}
                  className="px-6 py-2 bg-vino text-white rounded-lg hover:bg-vino/90 transition-colors"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-vino hover:bg-vino/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-vino/20">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="text-vino/70 text-sm pb-3 border-b border-vino/20">
                  Hola, {profile?.full_name || user?.email?.split('@')[0]}!
                </div>
                <Link 
                  to="/chat" 
                  className="block w-full px-4 py-3 bg-vino text-white rounded-lg hover:bg-vino/90 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Chatear
                </Link>
                <Link 
                  to="/dashboard" 
                  className="flex items-center justify-center px-4 py-3 text-vino hover:bg-vino/10 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </Link>
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
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/chat" 
                  className="block w-full px-4 py-3 bg-vino text-white rounded-lg hover:bg-vino/90 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Probar Chat
                </Link>
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
                  className="block w-full px-4 py-3 border-2 border-vino text-vino rounded-lg hover:bg-vino hover:text-white transition-colors text-center"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-vino mb-4 sm:mb-6 font-quicksand leading-tight">
            Tu Asistente Personal
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-vino to-purple-600">
              con Chamuyo Argentino
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-vino/80 mb-6 sm:mb-8 leading-relaxed px-4">
            Laubot combina inteligencia artificial con el arte del chamuyo argentino 
            para crear conversaciones auténticas y gestionar tu calendario con estilo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link 
              to="/chat"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-vino text-white rounded-xl hover:bg-vino/90 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Comenzar a Chatear
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
            
            <Link 
              to="/chat"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-vino text-vino rounded-xl hover:bg-vino hover:text-white transition-all text-sm sm:text-base"
            >
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Chatear con Laubot
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-vino text-center mb-8 sm:mb-16 font-quicksand px-4">
          ¿Qué hace especial a Laubot?
        </h2>
        
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all">
            <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-vino mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-vino mb-3 sm:mb-4">Chamuyo Inteligente</h3>
            <p className="text-sm sm:text-base text-vino/70">
              Conversaciones naturales con el toque argentino que necesitás. 
              Desde charlas casuales hasta negociaciones importantes.
            </p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-vino mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-vino mb-3 sm:mb-4">Calendario Integrado</h3>
            <p className="text-sm sm:text-base text-vino/70">
              Gestión completa de tu agenda con sincronización con Google Calendar. 
              Nunca más te olvides de una reunión importante.
            </p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all">
            <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-vino mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-vino mb-3 sm:mb-4">IA Personalizada</h3>
            <p className="text-sm sm:text-base text-vino/70">
              Inteligencia artificial que aprende tu estilo y se adapta a tus necesidades. 
              Cada conversación es única y auténtica.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="bg-gradient-to-r from-vino to-purple-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-quicksand">
            ¿Listo para comenzar?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">
            Descubrí el poder del chamuyo argentino combinado con tecnología de vanguardia
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              to="/chat"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-vino rounded-xl hover:bg-gray-100 transition-all font-semibold text-sm sm:text-base"
            >
              Empezar Gratis
            </Link>
            
            <Link 
              to="/laboratorio"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-vino transition-all text-sm sm:text-base"
            >
              Laboratorio de Chamuyo
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 border-t border-vino/20">
        <div className="text-center text-vino/60 text-sm sm:text-base">
          <p>&copy; 2024 Laubot. Hecho con ❤️ en Argentina.</p>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab={authModalTab}
        />
      )}
    </div>
  );
};

export default Index;
