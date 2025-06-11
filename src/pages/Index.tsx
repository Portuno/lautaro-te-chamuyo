import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSEO } from '../hooks/useSEO';
import { MessageCircle, FlaskConical, LayoutDashboard } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import PersonalizedWelcome from '../components/PersonalizedWelcome';
import NewsletterSubscription from '../components/NewsletterSubscription';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <MessageCircle className="w-8 h-8 text-coral" />, 
    title: 'Chat Inteligente',
    desc: 'Conversá con Lautaro, tu asistente IA con onda porteña.',
    link: '/chat',
    cta: 'Probar Chat'
  },
  {
    icon: <FlaskConical className="w-8 h-8 text-vino" />, 
    title: 'Laboratorio',
    desc: 'Experimentá con funciones nuevas y demos exclusivas.',
    link: '/laboratorio',
    cta: 'Ir al Lab'
  },
  {
    icon: <LayoutDashboard className="w-8 h-8 text-terracota" />, 
    title: 'Dashboard',
    desc: 'Organizá tu agenda, tareas y recordatorios en un solo lugar.',
    link: '/dashboard',
    cta: 'Ver Dashboard'
  },
  {
    icon: <FaWhatsapp className="w-8 h-8 text-green-500" />,
    title: 'Hablar por WhatsApp',
    desc: 'Chateá con Lautaro directamente desde WhatsApp, estés donde estés.',
    link: 'https://wa.me/5491123456789', // Reemplaza por el link real si lo tienes
    cta: 'Hablar por WhatsApp',
    external: true
  }
];

const Index = () => {
  const { isAuthenticated, profile } = useAuth();

  // SEO optimization
  useSEO({
    title: 'Lautaro - Asistente Digital con Onda Porteña | Chat, Laboratorio y Dashboard',
    description: 'Probá Lautaro: chat inteligente, laboratorio de IA y dashboard de productividad. Todo en un solo lugar, con personalidad argentina.',
    keywords: 'asistente digital, chat IA, laboratorio, dashboard, productividad, inteligencia artificial argentina, whatsapp',
    type: 'website',
    image: 'https://lautaro-te-chamuyo.vercel.app/og-home.jpg'
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#2d0a1a] via-[#ffe7d6] to-[#ffd6c0] flex flex-col">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <div className="w-full h-full bg-gradient-to-br from-[#2d0a1a]/80 via-coral/10 to-transparent rounded-3xl blur-2xl opacity-60"></div>
        </div>
        <h1 className="relative z-10 text-5xl md:text-6xl font-bold text-white mb-4 font-quicksand drop-shadow-xl">
          Lautaro
        </h1>
        <p className="relative z-10 text-lg md:text-2xl text-white/90 mb-6 max-w-2xl mx-auto font-medium drop-shadow">
          Tu asistente digital con inteligencia artificial y personalidad argentina. Organiza, conversa y experimenta, todo en un solo lugar.
        </p>
        <div className="relative z-10 mb-2">
          <PersonalizedWelcome />
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-4xl mx-auto w-full px-4 py-8">
        <h2 className="text-xl md:text-2xl font-bold text-vino mb-6 text-center font-quicksand">¿Qué podés hacer con Lautaro?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            f.external ? (
              <a
                href={f.link}
                key={i}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-[#2e1e21] rounded-2xl shadow-md p-6 flex flex-col items-center gap-2 border border-beige/30 hover:scale-105 hover:shadow-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-coral min-h-[220px]"
                tabIndex={0}
                aria-label={f.title}
              >
                <div className="mb-1 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-base font-bold text-vino mb-1 font-quicksand text-center group-hover:text-coral transition-colors">
                  {f.title}
                </h3>
                <p className="text-vino/80 text-sm text-center font-normal group-hover:text-vino transition-colors">
                  {f.desc}
                </p>
                <span className="mt-auto inline-block px-3 py-1 rounded-full bg-green-500 text-white font-semibold shadow-sm text-xs group-hover:bg-green-600 group-hover:text-white transition-all mt-4">
                  {f.cta}
                </span>
              </a>
            ) : (
              <Link
                to={f.link}
                key={i}
                className="group bg-white dark:bg-[#2e1e21] rounded-2xl shadow-md p-6 flex flex-col items-center gap-2 border border-beige/30 hover:scale-105 hover:shadow-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-coral min-h-[220px]"
                tabIndex={0}
                aria-label={f.title}
              >
                <div className="mb-1 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-base font-bold text-vino mb-1 font-quicksand text-center group-hover:text-coral transition-colors">
                  {f.title}
                </h3>
                <p className="text-vino/80 text-sm text-center font-normal group-hover:text-vino transition-colors">
                  {f.desc}
                </p>
                <span className="mt-auto inline-block px-3 py-1 rounded-full bg-coral text-vino font-semibold shadow-sm text-xs group-hover:bg-vino group-hover:text-beige transition-all mt-4">
                  {f.cta}
                </span>
              </Link>
            )
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-10 bg-white flex justify-center items-center border-t border-beige/30">
        <div className="w-full max-w-xl mx-auto px-4">
          <div className="rounded-2xl shadow-lg bg-sand/80 p-8">
            <NewsletterSubscription />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-12 flex flex-col items-center justify-center bg-gradient-to-t from-coral/20 to-transparent">
        <h2 className="text-xl md:text-2xl font-bold text-vino mb-4 font-quicksand text-center">¿Listo para probar Lautaro?</h2>
        <Link
          to="/chat"
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-vino to-coral text-white font-bold text-lg shadow-lg hover:scale-105 hover:from-coral hover:to-vino transition-all focus:outline-none focus:ring-2 focus:ring-coral"
        >
          Probar Chat
        </Link>
      </section>
    </main>
  );
};

export default Index;
