import ChatHeader from "@/components/ChatHeader";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessageBubble from "@/components/ChatMessageBubble";
import ChatInput from "@/components/ChatInput";
import QuickActionsBar from "@/components/QuickActionsBar";
import TypingIndicator from "@/components/TypingIndicator";
import NavigationBar from "@/components/NavigationBar";
import { useState } from "react";

// Add type that matches the props for ChatMessageBubble
type DemoMessage = {
  id: number;
  sender: "user" | "lautaro";
  content: string;
  mood?: "amable" | "picaro" | "tierno";
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

// Respuestas predefinidas de Lautaro
const LAUTARO_RESPONSES = {
  default: [
    "¡Qué interesante lo que me contás! ¿Querés que profundicemos en eso? 😊",
    "Me encanta cómo pensás. ¿Te gustaría que exploremos más sobre ese tema? 🤔",
    "¡Qué buena onda! ¿Hay algo más en lo que pueda ayudarte? 😉",
  ],
  greeting: [
    "¡Hola! ¿Cómo estás hoy? 😊",
    "¡Qué bueno verte! ¿En qué puedo ayudarte? 🤵‍♂️",
    "¡Hola! Estoy acá para lo que necesites 💫",
  ],
  mood: [
    "¿Sabés qué? Tu sonrisa es contagiosa, incluso por chat 😊",
    "Si fueras un color, serías el más brillante del arcoíris 🌈",
    "¿Querés que te cuente un chiste? Siempre funciona para levantar el ánimo 😉",
  ],
};

const getLautaroResponse = (message: string): { content: string; mood: "amable" | "picaro" | "tierno" } => {
  const lowerMessage = message.toLowerCase();
  
  // Detectar saludos
  if (lowerMessage.includes("hola") || lowerMessage.includes("buenas") || lowerMessage.includes("buen día")) {
    return {
      content: LAUTARO_RESPONSES.greeting[Math.floor(Math.random() * LAUTARO_RESPONSES.greeting.length)],
      mood: "amable"
    };
  }
  
  // Detectar mensajes sobre el estado de ánimo
  if (lowerMessage.includes("ánimo") || lowerMessage.includes("triste") || lowerMessage.includes("bajón")) {
    return {
      content: LAUTARO_RESPONSES.mood[Math.floor(Math.random() * LAUTARO_RESPONSES.mood.length)],
      mood: "tierno"
    };
  }
  
  // Respuesta por defecto
  return {
    content: LAUTARO_RESPONSES.default[Math.floor(Math.random() * LAUTARO_RESPONSES.default.length)],
    mood: "amable"
  };
};

const Chat = () => {
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (content: string) => {
    const newMessage: DemoMessage = {
      id: messages.length + 1,
      sender: "user",
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);
    
    // Simular respuesta de Lautaro después de 1 segundo
    setTimeout(() => {
      const { content: responseContent, mood } = getLautaroResponse(content);
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
          <QuickActionsBar />

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

export default Chat;
