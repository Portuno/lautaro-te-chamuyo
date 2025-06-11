import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Mail, MessageSquare, Heart, Calendar, BarChart3, Settings } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-vino to-terracota text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold font-quicksand">Lautaro</span>
              <Heart className="w-5 h-5 text-coral" />
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              Tu asistente digital con onda porteña. Inteligencia artificial que te entiende y te acompaña en tu día a día.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/portuno_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Seguinos en Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/JayCharni"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Seguinos en Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-quicksand">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/chat" 
                  className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat con Lautaro
                </Link>
              </li>
              <li>
                <Link 
                  to="/funciones" 
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Funciones
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/perfil" 
                  className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Mi Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-quicksand">Producto</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/roadmap" 
                  className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Roadmap
                </Link>
              </li>
              <li>
                <Link 
                  to="/laboratorio" 
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Laboratorio
                </Link>
              </li>
              <li>
                <a 
                  href="https://mabot.app" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  MABOT Platform
                </a>
              </li>
              <li>
                <a 
                  href="/#demo" 
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Demo Gratis
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-quicksand">Contacto</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/contacto" 
                  className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contactanos
                </Link>
              </li>
              <li>
                <Link 
                  to="/chat" 
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Soporte via Chat
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:hola@lautaro.com" 
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  hola@lautaro.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="text-white/70 text-sm">
            <p>© 2024 Lautaro. Hecho con ❤️ en Buenos Aires, Argentina.</p>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm">
            <Link 
              to="/privacidad" 
              className="text-white/70 hover:text-white transition-colors"
            >
              Privacidad
            </Link>
            <Link 
              to="/terminos" 
              className="text-white/70 hover:text-white transition-colors"
            >
              Términos
            </Link>
            <Link 
              to="/cookies" 
              className="text-white/70 hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>

        {/* Fun Footer Message */}
        <div className="text-center mt-8 pt-6 border-t border-white/10">
          <p className="text-white/60 text-xs italic">
            "Che, gracias por llegar hasta acá. Te debo un café virtual ☕"
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 