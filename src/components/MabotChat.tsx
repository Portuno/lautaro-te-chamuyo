import { useState, useEffect, useCallback } from 'react';
import { AsyncMabotClient, MabotError } from '../lib/mabotclient';
import { UpdateOut } from '../lib/update';
import { API_BASE_URL } from '../config';
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

export function MabotChat() {
  const [client, setClient] = useState<AsyncMabotClient | null>(null);
  const [messages, setMessages] = useState<Message[]>([{
    sender: 'lautaro',
    content: 'Buenas, soy Lautaro. Podés escribirme lo que quieras, o aprovechar y apretar algunas de las funciones rápidas de abajo!',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [ansiosaSequence, setAnsiosaSequence] = useState<'idle' | 'typing1' | 'pause' | 'typing2'>('idle');

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

  const initializeClient = useCallback(async () => {
    try {
      const username = import.meta.env.VITE_MABOT_USERNAME;
      const password = import.meta.env.VITE_MABOT_PASSWORD;
      
      if (!username || !password) {
        setUseFallback(true);
        setIsInitialized(true);
        return;
      }

      const mabotClient = new AsyncMabotClient({
        baseUrl: API_BASE_URL,
        username,
        password,
        timeout: 30000,
      });
      await mabotClient.loadToken();
      setClient(mabotClient);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setUseFallback(true);
      setIsInitialized(true);
      setError(null);
    }
  }, []);

  useEffect(() => {
    initializeClient();
  }, [initializeClient]);

  const handleSendMessage = async (input: string, options?: { isQuickAction?: boolean }) => {
    if (!input.trim() || isTyping) return;
    setIsTyping(true);
    setError(null);
    
    // Add user message
    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        content: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Fallback logic
    if (useFallback || !client) {
      setTimeout(() => {
        const intent = detectIntent(input);
        // If quick action, always use natural response
        if (options?.isQuickAction) {
          let response: string;
          if (intent === 'ideas') {
            response = getRandomResponse(FALLBACK_RESPONSES.ideas);
          } else if (intent === 'motivation') {
            response = getRandomResponse(FALLBACK_RESPONSES.motivation);
          } else if (intent === 'relax') {
            response = getRandomResponse(FALLBACK_RESPONSES.relax);
          } else if (intent === 'flirty') {
            response = getRandomResponse(FALLBACK_RESPONSES.flirty);
          } else if (intent === 'greetings') {
            response = getRandomResponse(FALLBACK_RESPONSES.greetings);
          } else {
            response = getRandomResponse(FALLBACK_RESPONSES.default);
          }
          setMessages(prev => [
            ...prev,
            {
              sender: 'lautaro',
              content: response,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setIsTyping(false);
          return;
        }
        // If user asks about Mabot/credenciales/premium, show link
        if (intent === 'mabot') {
          const response = getRandomResponse(FALLBACK_RESPONSES.mabot);
          setMessages(prev => [
            ...prev,
            {
              sender: 'lautaro',
              content: response,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isHtml: true
            }
          ]);
          setIsTyping(false);
          return;
        }
        // For any other free question, mention credentials
        setMessages(prev => [
          ...prev,
          {
            sender: 'lautaro',
            content: 'Para poder ayudarte con eso, necesito que configures mis credenciales de Mabot.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      }, Math.random() * 500 + 800);
      return;
    }

    const currentChatId = chatId || crypto.randomUUID();
    if (!chatId) setChatId(currentChatId);
    
    try {
      const response: UpdateOut = await client.sendMessage(currentChatId, input);
      const assistantMessage = response.messages[response.messages.length - 1];
      if (assistantMessage) {
        const textContent = assistantMessage.contents.find(c => c.type === 'text');
        if (textContent) {
          setMessages(prev => [
            ...prev,
            {
              sender: 'lautaro',
              content: textContent.value,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof MabotError
        ? error.message
        : 'An error occurred while sending the message';
      setError(errorMessage);
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