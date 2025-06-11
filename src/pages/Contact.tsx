import React, { useState } from 'react';
import { Send, User, Mail, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  message: string;
  category: string;
  sendCopy: boolean;
}

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
    category: '',
    sendCopy: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showShortMessageWarning, setShowShortMessageWarning] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});

  const categories = [
    { id: 'suggestion', label: 'Sugerencia para mejorar Lautaro', icon: '💡' },
    { id: 'collaboration', label: 'Propuesta de colaboración', icon: '🤝' },
    { id: 'investment', label: 'Interés en inversión o apoyo', icon: '💸' },
    { id: 'feedback', label: 'Feedback técnico o de usabilidad', icon: '🧪' },
    { id: 'press', label: 'Prensa o difusión', icon: '📢' },
    { id: 'other', label: 'Otra cosa que no entra en ninguna', icon: '❓' }
  ];

  const handleInputChange = (field: keyof ContactForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear submit error
    if (submitError) {
      setSubmitError(null);
    }
    
    // Check message length
    if (field === 'message' && typeof value === 'string') {
      setShowShortMessageWarning(value.length > 0 && value.length < 20);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};
    
    if (!form.email.trim()) {
      newErrors.email = 'Necesito tu mail para poder responderte';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'El mail no parece válido, fijate si está bien escrito';
    }
    
    if (!form.message.trim()) {
      newErrors.message = 'Contame algo, aunque sea un "hola"';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Un poquito más de detalle me vendría bien';
    }
    
    if (!form.category) {
      newErrors.category = 'Elegí una categoría para que no me pierda';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare form data for Formspree
      const formData = new FormData();
      formData.append('email', form.email);
      formData.append('name', form.name || 'Persona misteriosa');
      formData.append('message', form.message);
      formData.append('category', categories.find(c => c.id === form.category)?.label || form.category);
      formData.append('send_copy', form.sendCopy ? 'Sí' : 'No');
      
      // Add formatted message for better readability
      const formattedMessage = `
CONTACTO DESDE LAUTARO
===================

👤 Nombre: ${form.name || 'Persona misteriosa'}
📧 Email: ${form.email}
📋 Categoría: ${categories.find(c => c.id === form.category)?.icon} ${categories.find(c => c.id === form.category)?.label}
📄 Copia solicitada: ${form.sendCopy ? 'Sí' : 'No'}

💬 Mensaje:
${form.message}

---
Enviado desde: lautaro-te-chamuyo.vercel.app
Fecha: ${new Date().toLocaleString('es-AR')}
      `;
      
      formData.append('_formatted_message', formattedMessage);
      
      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/movwdjpd', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        
        // Reset form after success
        setTimeout(() => {
          setForm({
            name: '',
            email: '',
            message: '',
            category: '',
            sendCopy: false
          });
          setIsSubmitted(false);
        }, 8000);
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar el mensaje');
      }
      
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setSubmitError('Ups, algo salió mal. ¿Probás de nuevo en un ratito?');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige via-sand to-[#ffd6c0] dark:from-[#201016] dark:to-[#442134] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/95 dark:bg-[#2e1e21]/95 rounded-2xl shadow-xl p-8 text-center backdrop-blur-sm">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-vino dark:text-beige mb-2">
            ¡Gracias! Ya lo estoy leyendo con atención.
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Si es importante, no te preocupes: te voy a responder. Si es interesante, seguro también.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#3e2e31] rounded-lg p-3 mb-6">
            📧 Tu mensaje me llegó directo al mail. 
            {form.sendCopy && <><br />"También te envié una copia a tu casilla."</>}
          </div>
          
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-vino dark:text-beige hover:underline text-sm transition-colors"
          >
            ← Volver al formulario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-sand to-[#ffd6c0] dark:from-[#201016] dark:to-[#442134] py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">🧭</span>
            <h1 className="text-2xl md:text-3xl font-bold text-vino dark:text-beige">
              Zona de Contacto
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            <span className="text-lg font-medium">¿Tenés algo para contarme?</span><br />
            Estoy para leerte. Sugerencias, ideas, propuestas o algo que te gustaría ver en Lautaro.
          </p>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{submitError}</span>
            </div>
          </div>
        )}

        {/* Compact Form in Single Card */}
        <div className="bg-white/95 dark:bg-[#2e1e21]/95 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name and Email in Same Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Tu nombre <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Así sé cómo llamarte"
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vino focus:border-vino dark:bg-[#3e2e31] dark:text-beige transition-colors text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Tu mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Para poder responderte"
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-vino focus:border-vino dark:bg-[#3e2e31] dark:text-beige transition-colors text-sm ${
                    errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Category Selection - Compact Grid */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                ¿Sobre qué es esto? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-[#4e3e41] text-sm ${
                      form.category === category.id
                        ? 'border-vino bg-vino/5 dark:bg-vino/10'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={form.category === category.id}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-gray-700 dark:text-gray-300 leading-tight">
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.category && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Tu mensaje <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Contame lo que tenés en mente. Te escucho."
                rows={4}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-vino focus:border-vino dark:bg-[#3e2e31] dark:text-beige transition-colors resize-none text-sm ${
                  errors.message ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                required
              />
              
              {/* Short message warning */}
              {showShortMessageWarning && !errors.message && (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  ¿Querés agregar un poco más? Me viene bien para entenderte mejor.
                </p>
              )}
              
              {errors.message && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.message}
                </p>
              )}
              
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {form.message.length} caracteres
              </div>
            </div>

            {/* Send Copy Option and Submit Button in Same Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="send_copy"
                  checked={form.sendCopy}
                  onChange={(e) => handleInputChange('sendCopy', e.target.checked)}
                  className="w-4 h-4 text-vino bg-gray-100 border-gray-300 rounded focus:ring-vino dark:focus:ring-vino dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Enviarme una copia a mi mail
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-vino hover:bg-vino/90 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar mensaje
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Compact Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tu mensaje me llega directo. No spam, no robots, solo atención humana.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact; 