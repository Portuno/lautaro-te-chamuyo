
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useNewsletter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const subscribe = async (email: string, sourcePage: string = 'unknown') => {
    if (!email.trim()) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email para suscribirte.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido.",
        variant: "destructive",
      });
      return false;
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
        if (error.code === '23505') {
          toast({
            title: "Ya estás suscrito",
            description: "Este email ya está registrado en nuestro newsletter.",
            variant: "default",
          });
        } else {
          throw error;
        }
        return false;
      } else {
        toast({
          title: "¡Suscripción exitosa!",
          description: "Te has suscrito correctamente al newsletter de Lautaro.",
        });
        return true;
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: "Error al suscribirse",
        description: "Hubo un problema al procesar tu suscripción. Intenta nuevamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  };

  return {
    subscribe,
    getSubscriptions,
    isLoading
  };
};
