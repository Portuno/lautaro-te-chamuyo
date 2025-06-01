import React, { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "./AuthModal";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const { isAuthenticated, user, signOut } = useAuth();

  const navItems = [
    { href: "/chat", label: "Chat" },
    { href: "/laboratorio", label: "Laboratorio" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/funciones", label: "Funciones" },
  ];

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
      <nav className="bg-vino/95 backdrop-blur-sm border-b border-vino/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-beige font-quicksand">
                Lautaro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-beige hover:text-coral transition-colors font-medium font-quicksand"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Authentication Buttons */}
              <div className="flex items-center space-x-3 ml-4 border-l border-beige/30 pl-4">
                {isAuthenticated ? (
                  <>
                    {/* Profile Button */}
                    <Link
                      to="/perfil"
                      className="flex items-center space-x-2 text-beige hover:text-coral transition-colors font-medium"
                    >
                      <User className="w-4 h-4" />
                      <span>Perfil</span>
                    </Link>
                    
                    {/* Logout Button */}
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      size="sm"
                      className="text-beige border-beige hover:bg-beige hover:text-vino"
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
                      className="text-beige hover:text-coral"
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
                className="text-beige hover:text-coral"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-beige hover:text-coral transition-colors font-medium py-2 font-quicksand"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile Authentication */}
                <div className="border-t border-beige/30 pt-3 mt-3">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/perfil"
                        className="flex items-center space-x-2 text-beige hover:text-coral transition-colors font-medium py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Perfil</span>
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 text-beige hover:text-coral transition-colors font-medium py-2 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Salir</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleShowLogin}
                        className="text-beige hover:text-coral transition-colors font-medium py-2 w-full text-left"
                      >
                        Iniciar Sesión
                      </button>
                      <button
                        onClick={handleShowRegister}
                        className="text-beige hover:text-coral transition-colors font-medium py-2 w-full text-left"
                      >
                        Registrarse
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
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
