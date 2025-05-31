import ChatHeader from "@/components/ChatHeader";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessageBubble from "@/components/ChatMessageBubble";
import ChatInput from "@/components/ChatInput";
import QuickActionsBar from "@/components/QuickActionsBar";
import TypingIndicator from "@/components/TypingIndicator";
import NavigationBar from "@/components/NavigationBar";
import { ChatConfigProvider, useStyledResponse, type ConversationStyle } from "@/hooks/useChatConfig";
import { useState } from "react";

// Add type that matches the props for ChatMessageBubble
type DemoMessage = {
  id: number;
  sender: "user" | "lautaro";
  content: string;
  mood?: ConversationStyle | "picaro";
  time?: string;
};

// Mensajes demo para la UI inicial
const DEMO_MESSAGES: DemoMessage[] = [
  {
    id: 1,
    sender: "lautaro",
    content: "¡Hola! Soy Lautaro 🤵‍♂️. ¿En qué te ayudo hoy?",
    mood: "amable",
    time: "10:11",
  },
  {
    id: 2,
    sender: "user",
    content: "Recomendame algo para levantarme el ánimo.",
    // No mood for user (optional)
    time: "10:12",
  },
  {
    id: 3,
    sender: "lautaro",
    content: "¿Probaste escuchar tu canción favorita? Y si querés, te puedo tirar una frase que te suba el día 😉.",
    mood: "picaro",
    time: "10:13",
  },
];

const ChatContent = () => {
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const { generateResponse } = useStyledResponse();

  const handleSendMessage = (content: string) => {
    const newMessage: DemoMessage = {
      id: messages.length + 1,
      sender: "user",
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);
    
    // Simular respuesta de Lautaro después de 1 segundo usando el hook estilizado
    setTimeout(() => {
      const { content: responseContent, mood } = generateResponse(content);
      const lautaroResponse: DemoMessage = {
        id: messages.length + 2,
        sender: "lautaro",
        content: responseContent,
        mood,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, lautaroResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-beige via-sand to-[#ffd6c0] dark:from-[#201016] dark:to-[#442134] flex flex-col">
      <NavigationBar />
      
      <div className="flex flex-1">
        {/* Sidebar (oculto en móvil, visible o "expandible" en desktop) */}
        <ChatSidebar />

        {/* Chat principal */}
        <div className="w-full max-w-2xl mx-auto flex flex-col min-h-0 flex-1 relative">
          <ChatHeader />

          {/* Zona de mensajes */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 pt-[76px] md:px-6 md:pt-[90px] bg-transparent" style={{scrollbarGutter: "stable"}}>
            {messages.map(msg => (
              <ChatMessageBubble
                key={msg.id}
                sender={msg.sender}
                content={msg.content}
                mood={msg.mood}
                time={msg.time}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </div>

          {/* Barra de acciones rápidas */}
          <QuickActionsBar onSendMessage={handleSendMessage} />

          {/* Input */}
          <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />

          {/* Opcional: barra de feedback, CTA suave */}
          <div className="text-center my-2 opacity-80 text-sm">
            ¿Querés desbloquear todo el chamuyo de Lautaro?{" "}
            <a href="/#" className="text-vino hover:underline font-semibold">Probá el modo Premium</a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  return (
    <ChatConfigProvider>
      <ChatContent />
    </ChatConfigProvider>
  );
};

export default Chat;
