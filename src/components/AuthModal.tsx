import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const { signIn, signUp, resetPassword, loading } = useAuth();

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (activeTab === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setLocalError('Las contraseñas no coinciden');
        return;
      }
      if (formData.password.length < 6) {
        setLocalError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
    }

    try {
      let result;
      if (activeTab === 'login') {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password, formData.fullName);
      }

      if (result.success) {
        if (activeTab === 'register') {
          setSuccessMessage('¡Registro exitoso! Ahora podés iniciar sesión.');
          setActiveTab('login');
          setFormData(prev => ({ ...prev, fullName: '', confirmPassword: '' }));
        } else {
          onClose();
          setFormData({ email: '', password: '', fullName: '', confirmPassword: '' });
        }
      } else {
        setLocalError(result.error || 'Error desconocido');
      }
    } catch (error) {
      setLocalError('Error de conexión');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (!resetEmail) {
      setLocalError('Ingresá tu email para recuperar la contraseña');
      return;
    }

    try {
      const result = await resetPassword(resetEmail);
      
      if (result.success) {
        setSuccessMessage('Te enviamos un email con las instrucciones para recuperar tu contraseña. Revisá tu bandeja de entrada.');
        setShowForgotPassword(false);
        setResetEmail('');
      } else {
        setLocalError(result.error || 'Error enviando email de recuperación');
      }
    } catch (error) {
      setLocalError('Error de conexión');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-vino font-quicksand">
            {showForgotPassword 
              ? 'Recuperar Contraseña' 
              : activeTab === 'login' 
                ? 'Iniciar Sesión' 
                : 'Registrarse'
            }
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error/Success Messages */}
          {localError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {localError}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          {/* Forgot Password Form */}
          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Ingresá tu email y te enviaremos las instrucciones para recuperar tu contraseña.
              </div>
              
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vino-light focus:border-transparent"
                  placeholder="tu-email@ejemplo.com"
                  required
                />
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-vino text-white py-2 px-4 rounded-lg hover:bg-vino-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar Email de Recuperación'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setLocalError('');
                    setSuccessMessage('');
                  }}
                  className="w-full text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setLocalError('');
                    setSuccessMessage('');
                  }}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    activeTab === 'login'
                      ? 'bg-white text-vino shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setActiveTab('register');
                    setLocalError('');
                    setSuccessMessage('');
                  }}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    activeTab === 'register'
                      ? 'bg-white text-vino shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field (Register only) */}
                {activeTab === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vino focus:border-transparent"
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vino focus:border-transparent"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vino focus:border-transparent"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Confirm Password Field (Register only) */}
                {activeTab === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vino focus:border-transparent"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-vino text-white py-3 px-4 rounded-lg font-medium hover:bg-vino-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading 
                    ? (activeTab === 'login' ? 'Iniciando sesión...' : 'Registrando...') 
                    : (activeTab === 'login' ? 'Iniciar Sesión' : 'Registrarse')
                  }
                </button>

                {/* Forgot Password Link (Login only) */}
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setLocalError('');
                      setSuccessMessage('');
                    }}
                    className="w-full text-sm text-gray-600 hover:text-vino transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}

                {/* Switch Tab Link */}
                <div className="text-center text-sm text-gray-600">
                  {activeTab === 'login' ? (
                    <>
                      ¿No tenés cuenta?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('register');
                          setLocalError('');
                          setSuccessMessage('');
                        }}
                        className="text-vino hover:underline font-medium"
                      >
                        Registrate acá
                      </button>
                    </>
                  ) : (
                    <>
                      ¿Ya tenés cuenta?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('login');
                          setLocalError('');
                          setSuccessMessage('');
                        }}
                        className="text-vino hover:underline font-medium"
                      >
                        Iniciá sesión
                      </button>
                    </>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 