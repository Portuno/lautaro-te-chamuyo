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
  const { signIn, signUp, resetPassword, loading, signInWithGoogle } = useAuth();

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setFormData({
        email: '',
        password: '',
        fullName: '',
        confirmPassword: ''
      });
      setLocalError('');
      setSuccessMessage('');
      setShowForgotPassword(false);
      setResetEmail('');
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
    setSuccessMessage('');
  };

  // Check if form is valid
  const isFormValid = () => {
    const emailValid = formData.email.trim() !== '';
    const passwordValid = formData.password.trim() !== '';
    
    if (activeTab === 'login') {
      const result = emailValid && passwordValid;
      console.log('🔍 Login Form Validation:', {
        email: formData.email,
        emailValid,
        password: formData.password ? '***filled***' : 'empty',
        passwordValid,
        result,
        loading
      });
      return result;
    } else {
      const fullNameValid = formData.fullName.trim() !== '';
      const confirmPasswordValid = formData.confirmPassword.trim() !== '';
      const passwordsMatch = formData.password === formData.confirmPassword;
      const passwordLengthOk = formData.password.length >= 6;
      
      const result = emailValid && passwordValid && fullNameValid && 
        confirmPasswordValid && passwordsMatch && passwordLengthOk;
      
      console.log('🔍 Register Form Validation:', {
        emailValid,
        passwordValid,
        fullNameValid,
        confirmPasswordValid,
        passwordsMatch,
        passwordLengthOk,
        result,
        loading
      });
      return result;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    console.log('📝 Form submitted:', {
      activeTab,
      formData: {
        email: formData.email,
        password: formData.password ? '***filled***' : 'empty',
        fullName: formData.fullName || 'not provided'
      },
      isFormValid: isFormValid()
    });

    if (!isFormValid()) {
      console.log('❌ Form validation failed');
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
      return;
    }

    try {
      console.log('🚀 Calling auth function...');
      let result;
      if (activeTab === 'login') {
        console.log('🔑 Calling signIn...');
        result = await signIn(formData.email, formData.password);
        console.log('🔑 SignIn result:', result);
      } else {
        console.log('📝 Calling signUp...');
        result = await signUp(formData.email, formData.password, formData.fullName);
        console.log('📝 SignUp result:', result);
      }

      console.log('📊 Auth result received:', result);

      if (result.success) {
        console.log('✅ Auth successful');
        if (activeTab === 'register') {
          setSuccessMessage('¡Registro exitoso! Ahora podés iniciar sesión.');
          setActiveTab('login');
          setFormData(prev => ({ ...prev, fullName: '', confirmPassword: '' }));
        } else {
          console.log('🚪 Closing modal after successful login');
          onClose();
          setFormData({ email: '', password: '', fullName: '', confirmPassword: '' });
        }
      } else {
        console.log('❌ Auth failed:', result.error);
        setLocalError(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.log('❌ HandleSubmit catch error:', error);
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

  const handleGoogleSignIn = async () => {
    setLocalError('');
    setSuccessMessage('');

    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        // OAuth redirect will handle closing the modal
      } else {
        setLocalError(result.error || 'Error al conectar con Google');
      }
    } catch (error) {
      setLocalError('Error de conexión con Google');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-[101]">
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
                  disabled={loading || !isFormValid()}
                  className="w-full bg-vino text-white py-3 px-4 rounded-lg font-medium hover:bg-vino/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-vino/80"
                  onClick={() => {
                    console.log('🔘 Button clicked! Disabled state:', loading || !isFormValid(), {
                      loading,
                      isFormValid: isFormValid(),
                      formData
                    });
                  }}
                >
                  {loading 
                    ? (activeTab === 'login' ? 'Iniciando sesión...' : 'Registrando...') 
                    : (activeTab === 'login' ? 'Iniciar Sesión' : 'Registrarse')
                  }
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">o</span>
                  </div>
                </div>

                {/* Google OAuth Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {activeTab === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}
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