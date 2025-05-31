import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MessageCircle, Calendar, Brain, Sparkles, ArrowRight, User, LogOut } from 'lucide-react';
import AuthModal from '../components/AuthModal';

const Index = () => {
  const { isAuthenticated, user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-sand to-vino/10">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-vino" />
            <span className="text-2xl font-bold text-vino font-quicksand">Laubot</span>
          </div>
          
          <div className="flex items-center space-x-4">
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
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-vino mb-6 font-quicksand">
            Tu Asistente Personal
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-vino to-purple-600">
              con Chamuyo Argentino
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-vino/80 mb-8 leading-relaxed">
            Laubot combina inteligencia artificial con el arte del chamuyo argentino 
            para crear conversaciones auténticas y gestionar tu calendario con estilo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/chat"
              className="inline-flex items-center px-8 py-4 bg-vino text-white rounded-xl hover:bg-vino/90 transition-all transform hover:scale-105 shadow-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Comenzar a Chatear
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link 
              to="/chat"
              className="inline-flex items-center px-8 py-4 border-2 border-vino text-vino rounded-xl hover:bg-vino hover:text-white transition-all"
            >
              <Brain className="w-5 h-5 mr-2" />
              Chatear con Laubot
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-vino text-center mb-16 font-quicksand">
          ¿Qué hace especial a Laubot?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all">
            <MessageCircle className="w-12 h-12 text-vino mb-4" />
            <h3 className="text-xl font-bold text-vino mb-4">Chamuyo Inteligente</h3>
            <p className="text-vino/70">
              Conversaciones naturales con el toque argentino que necesitás. 
              Desde charlas casuales hasta negociaciones importantes.
            </p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all">
            <Calendar className="w-12 h-12 text-vino mb-4" />
            <h3 className="text-xl font-bold text-vino mb-4">Calendario Integrado</h3>
            <p className="text-vino/70">
              Gestión completa de tu agenda con sincronización con Google Calendar. 
              Nunca más te olvides de una reunión importante.
            </p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all">
            <Brain className="w-12 h-12 text-vino mb-4" />
            <h3 className="text-xl font-bold text-vino mb-4">IA Personalizada</h3>
            <p className="text-vino/70">
              Inteligencia artificial que aprende tu estilo y se adapta a tus necesidades. 
              Cada conversación es única y auténtica.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-vino to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-quicksand">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Descubrí el poder del chamuyo argentino combinado con tecnología de vanguardia
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/chat"
              className="inline-flex items-center px-8 py-4 bg-white text-vino rounded-xl hover:bg-gray-100 transition-all font-semibold"
            >
              Empezar Gratis
            </Link>
            
            <Link 
              to="/laboratorio"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-vino transition-all"
            >
              Laboratorio de Chamuyo
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-vino/20">
        <div className="text-center text-vino/60">
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
