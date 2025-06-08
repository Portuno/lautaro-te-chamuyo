import { useState, useEffect, useCallback } from 'react';
import { FALLBACK_RESPONSES, detectIntent, getRandomResponse } from '../lib/fallbackResponses';
import ChatHeader from './ChatHeader';
import ChatSidebar from './ChatSidebar';
import ChatMessageBubble from './ChatMessageBubble';
import ChatInput from './ChatInput';
import QuickActionsBar from './QuickActionsBar';
import TypingIndicator from './TypingIndicator';

interface Message {
  sender: 'user' | 'lautaro';
  content: string;
  time?: string;
  isHtml?: boolean;
}

const STORAGE_KEYS = {
  CHAT_ID: 'chatId',
  MESSAGES: 'chatMessages',
  CURRENT_BOT: 'currentBot'
} as const;

export function MabotChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const storedMessages = sessionStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (storedMessages) {
      try {
        return JSON.parse(storedMessages);
      } catch {
        return [{
          sender: 'lautaro',
          content: 'Buenas, soy Lautaro. Podés escribirme lo que quieras, o aprovechar y apretar algunas de las funciones rápidas de abajo!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      }
    }
    return [{
      sender: 'lautaro',
      content: 'Buenas, soy Lautaro. Podés escribirme lo que quieras, o aprovechar y apretar algunas de las funciones rápidas de abajo!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
  });
  const [chatId, setChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [ansiosaSequence, setAnsiosaSequence] = useState<'idle' | 'typing1' | 'pause' | 'typing2'>('idle');
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Persistir mensajes en sessionStorage cuando cambian
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  // Generar un chatId único al montar el componente
  useEffect(() => {
    const storedChatId = sessionStorage.getItem(STORAGE_KEYS.CHAT_ID);
    if (storedChatId) {
      console.log('Usando chatId existente:', storedChatId);
      setChatId(storedChatId);
    } else {
      const newChatId = crypto.randomUUID();
      console.log('Generando nuevo chatId:', newChatId);
      sessionStorage.setItem(STORAGE_KEYS.CHAT_ID, newChatId);
      setChatId(newChatId);
    }
  }, []);

  const startNewConversation = useCallback(() => {
    const newChatId = crypto.randomUUID();
    console.log('Iniciando nueva conversación con chatId:', newChatId);
    sessionStorage.setItem(STORAGE_KEYS.CHAT_ID, newChatId);
    setChatId(newChatId);
    setMessages([{
      sender: 'lautaro',
      content: '¡Nueva conversación iniciada! ¿En qué puedo ayudarte?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  }, []);

  // Easter egg: handle sequence directly
  const handleEasterEggSequence = useCallback(() => {
    console.log('Easter egg triggered'); // Debug log
    setAnsiosaSequence('typing1');
    setTimeout(() => {
      setAnsiosaSequence('pause');
      setTimeout(() => {
        setAnsiosaSequence('typing2');
        setTimeout(() => {
          setAnsiosaSequence('idle');
          setMessages(prev => [
            ...prev,
            {
              sender: 'lautaro',
              content: 'No seas ansiosa, todavía no funciona eso 😏',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }, 3000);
      }, 2000);
    }, 3000);
  }, []);

  const handleSendMessage = async (input: string, options?: { isQuickAction?: boolean }) => {
    if (!input.trim() || isTyping || !chatId) {
      console.log('No se puede enviar mensaje:', { 
        input: input.trim(), 
        isTyping, 
        chatId 
      });
      return;
    }
    setIsTyping(true);
    setError(null);
    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        content: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      const response = await fetch('/api/mabot-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      if (!response.ok) {
        throw new Error('Error comunicando con el bot');
      }
      const data = await response.json();
      const botMessage = data?.messages?.[0]?.contents?.[0]?.value || 'Sin respuesta del bot.';
      setMessages(prev => [
        ...prev,
        {
          sender: 'lautaro',
          content: botMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setUseFallback(false);
    } catch (error) {
      setError('Error al comunicarse con el bot.');
      setUseFallback(true);
    } finally {
      setIsTyping(false);
    }
  };

  // Block input if typing or ansiosaSequence is active
  const inputBlocked = isTyping || ansiosaSequence === 'typing1' || ansiosaSequence === 'typing2';

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vino mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-beige via-sand to-[#ffd6c0] dark:from-[#201016] dark:to-[#442134] flex flex-col">
      <ChatHeader />
      <div className="flex flex-1">
        <ChatSidebar onEasterEgg={handleEasterEggSequence} />
        <div className="w-full max-w-2xl mx-auto flex flex-col min-h-0 flex-1 relative">
          <div className="flex-1 overflow-y-auto px-2 pb-4 pt-[76px] md:px-6 md:pt-[90px] bg-transparent" style={{scrollbarGutter: 'stable'}}>
            {useFallback && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💡</span>
                  <span className="font-semibold">Modo Demo Activo</span>
                </div>
                <p>
                  Para desbloquear todas mis funciones, visitá{' '}
                  <a 
                    href="https://mabot.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-vino hover:underline font-semibold"
                  >
                    mabot.app
                  </a>
                  {' '}y configurá mis credenciales.
                </p>
              </div>
            )}
            <button
              onClick={startNewConversation}
              className="text-vino dark:text-beige text-sm hover:underline mb-4"
              title="Iniciar nueva conversación"
            >
              Nueva conversación
            </button>
            {messages.map((msg, i) => (
              <ChatMessageBubble
                key={i}
                sender={msg.sender}
                content={msg.content}
                time={msg.time}
                isHtml={msg.isHtml}
              />
            ))}
            {(isTyping || ansiosaSequence === 'typing1' || ansiosaSequence === 'typing2') && (
              <TypingIndicator />
            )}
          </div>
          <div className="flex items-center justify-between px-2 py-1 bg-sand/80 dark:bg-[#2e1e21]/70 border-t border-beige/60">
            <button
              onClick={startNewConversation}
              className="text-vino dark:text-beige text-sm hover:underline"
              title="Iniciar nueva conversación"
            >
              Nueva conversación
            </button>
            <button
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="text-vino/50 dark:text-beige/50 text-xs hover:text-vino dark:hover:text-beige"
              title="Mostrar/ocultar información de debug"
            >
              {showDebugInfo ? 'Ocultar debug' : 'Mostrar debug'}
            </button>
          </div>
          {showDebugInfo && (
            <div className="px-2 py-1 bg-sand/80 dark:bg-[#2e1e21]/70 border-t border-beige/60 text-xs text-vino/70 dark:text-beige/70 font-mono">
              <div>ChatId: {chatId}</div>
            </div>
          )}
          <QuickActionsBar onSendMessage={handleSendMessage} />
          <ChatInput onSendMessage={handleSendMessage} isTyping={inputBlocked} />
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg">
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-red-700 hover:text-red-900"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          <div className="text-center my-2 opacity-80 text-sm">
            ¿Querés desbloquear todo el chamuyo de Lautaro?{' '}
            <a 
              href="https://mabot.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-vino hover:underline font-semibold"
            >
              Probá el modo Premium
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 