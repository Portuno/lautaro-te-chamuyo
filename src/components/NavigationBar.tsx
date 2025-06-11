import React, { useState } from "react";
import { Menu, X, User, LogOut, MessageSquare, Beaker, LayoutDashboard, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "./AuthModal";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const { isAuthenticated, user, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/laboratorio", label: "Laboratorio", icon: Beaker },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/funciones", label: "Funciones", icon: Sparkles },
    { href: "/contacto", label: "Contacto", icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleShowLogin = () => {
    setAuthModalTab('login');
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };

  const handleShowRegister = () => {
    setAuthModalTab('register');
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-vino/95 backdrop-blur-sm border-b border-vino/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-2xl sm:text-3xl font-bold text-beige font-quicksand group-hover:text-coral transition-colors">
                Lautaro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg
                      font-medium font-quicksand transition-all duration-200
                      ${isActive(item.href) 
                        ? 'bg-beige/20 text-coral' 
                        : 'text-beige hover:bg-beige/10 hover:text-coral'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Authentication Buttons */}
              <div className="flex items-center space-x-2 ml-4 border-l border-beige/30 pl-4">
                {isAuthenticated ? (
                  <>
                    {/* Profile Button */}
                    <Link
                      to="/perfil"
                      className={`
                        flex items-center space-x-2 px-3 py-2 rounded-lg
                        font-medium transition-all duration-200
                        ${isActive('/perfil') 
                          ? 'bg-beige/20 text-coral' 
                          : 'text-beige hover:bg-beige/10 hover:text-coral'
                        }
                      `}
                    >
                      <User className="w-4 h-4" />
                      <span>Perfil</span>
                    </Link>
                    
                    {/* Logout Button */}
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      size="sm"
                      className="text-beige border-beige hover:bg-beige hover:text-vino transition-all"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Salir
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleShowLogin}
                      variant="ghost"
                      size="sm"
                      className="text-beige hover:text-coral hover:bg-beige/10"
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      onClick={handleShowRegister}
                      variant="outline"
                      size="sm"
                      className="text-beige border-beige hover:bg-beige hover:text-vino"
                    >
                      Registrarse
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-beige hover:text-coral hover:bg-beige/10"
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation - Slide down animation */}
          <div
            className={`
              md:hidden overflow-hidden transition-all duration-300 ease-in-out
              ${isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'}
            `}
          >
            <div className="flex flex-col space-y-1 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg
                      font-medium font-quicksand transition-all duration-200
                      ${isActive(item.href) 
                        ? 'bg-beige/20 text-coral' 
                        : 'text-beige hover:bg-beige/10 hover:text-coral active:bg-beige/20'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-lg">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Authentication */}
              <div className="border-t border-beige/30 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/perfil"
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg
                        font-medium transition-all duration-200
                        ${isActive('/perfil') 
                          ? 'bg-beige/20 text-coral' 
                          : 'text-beige hover:bg-beige/10 hover:text-coral active:bg-beige/20'
                        }
                      `}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-lg">Perfil</span>
                    </Link>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-beige hover:bg-beige/10 hover:text-coral active:bg-beige/20 transition-all duration-200 font-medium w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-lg">Salir</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleShowLogin}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-beige hover:bg-beige/10 hover:text-coral active:bg-beige/20 transition-all duration-200 font-medium w-full text-left"
                    >
                      <span className="text-lg">Iniciar Sesión</span>
                    </button>
                    <button
                      onClick={handleShowRegister}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-beige hover:bg-beige/10 hover:text-coral active:bg-beige/20 transition-all duration-200 font-medium w-full text-left"
                    >
                      <span className="text-lg">Registrarse</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
      />
    </>
  );
};

export default NavigationBar;
