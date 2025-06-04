
import React, { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NewsletterSubscriptionProps {
  sourcePage?: string;
  className?: string;
  title?: string;
  description?: string;
}

const NewsletterSubscription = ({ 
  sourcePage = 'unknown',
  className = '',
  title = '¡Mantente al día con Lautaro!',
  description = 'Recibe las últimas actualizaciones, consejos y novedades directamente en tu email.'
}: NewsletterSubscriptionProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email para suscribirte.",
        variant: "destructive",
      });
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email: email.toLowerCase().trim(),
            source_page: sourcePage,
            is_active: true
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Ya estás suscrito",
            description: "Este email ya está registrado en nuestro newsletter.",
            variant: "default",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        setEmail('');
        toast({
          title: "¡Suscripción exitosa!",
          description: "Te has suscrito correctamente al newsletter de Lautaro.",
        });
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: "Error al suscribirse",
        description: "Hubo un problema al procesar tu suscripción. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center ${className}`}>
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ¡Gracias por suscribirte!
        </h3>
        <p className="text-green-700">
          Recibirás las últimas novedades de Lautaro en tu email.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-coral/10 to-vino/10 border border-coral/20 rounded-xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-coral to-vino rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-vino mb-2 font-quicksand">
          {title}
        </h3>
        <p className="text-vino/80 text-sm">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubscribe} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="flex-1 px-4 py-3 border border-coral/30 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent outline-none transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="px-6 py-3 bg-gradient-to-r from-coral to-vino text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Suscribiendo...
              </div>
            ) : (
              'Suscribirme'
            )}
          </button>
        </div>
        <p className="text-xs text-vino/60 text-center">
          No compartimos tu email. Puedes cancelar tu suscripción en cualquier momento.
        </p>
      </form>
    </div>
  );
};

export default NewsletterSubscription;
