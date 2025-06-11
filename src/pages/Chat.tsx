import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { ChatConfigProvider } from "@/hooks/useChatConfig";
import { MabotChat } from "../components/MabotChat";

const Chat = () => {
  // SEO optimization for Chat page
  useSEO({
    title: 'Chat con Lautaro - Asistente Digital IA | Conversación Natural',
    description: 'Chateá con Lautaro, tu asistente digital argentino con IA. Hacé preguntas, pedí ayuda con tareas, transcribí audios y más. Chat gratis disponible las 24 horas.',
    keywords: 'chat IA, asistente virtual, chatbot argentino, inteligencia artificial, conversación natural, ayuda digital, transcripción, calendario',
    type: 'website',
    image: 'https://lautaro-te-chamuyo.vercel.app/og-chat.jpg'
  });

  return (
    <ChatConfigProvider>
      <div className="min-h-screen">
        <MabotChat />
      </div>
    </ChatConfigProvider>
  );
};

export default Chat;
