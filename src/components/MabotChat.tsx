import { useState, useEffect, useCallback } from 'react';
import { AsyncMabotClient, MabotError } from '../lib/mabotClient';
import { UpdateOut } from '../lib/update';
import { API_BASE_URL } from '../config';
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
}

export function MabotChat() {
  const [client, setClient] = useState<AsyncMabotClient | null>(null);
  const [messages, setMessages] = useState<Message[]>([{
    sender: 'lautaro',
    content: '¡Hola! Soy Lautaro 🤵‍♂️. ¿En qué te ayudo hoy?',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeClient = useCallback(async () => {
    try {
      const mabotClient = new AsyncMabotClient({
        baseUrl: API_BASE_URL,
        username: import.meta.env.VITE_MABOT_USERNAME || '',
        password: import.meta.env.VITE_MABOT_PASSWORD || '',
        timeout: 30000,
      });
      await mabotClient.loadToken();
      setClient(mabotClient);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof MabotError 
        ? err.message 
        : 'Failed to initialize chat client. Please try again later.';
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    initializeClient();
  }, [initializeClient]);

  const handleSendMessage = async (input: string) => {
    if (!client || !input.trim() || isTyping) return;
    setIsTyping(true);
    setError(null);
    const currentChatId = chatId || crypto.randomUUID();
    if (!chatId) setChatId(currentChatId);
    // Add user message
    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        content: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
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

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-beige via-sand to-[#ffd6c0] dark:from-[#201016] dark:to-[#442134] flex flex-col">
      <ChatHeader />
      <div className="flex flex-1">
        <ChatSidebar />
        <div className="w-full max-w-2xl mx-auto flex flex-col min-h-0 flex-1 relative">
          <div className="flex-1 overflow-y-auto px-2 pb-4 pt-[76px] md:px-6 md:pt-[90px] bg-transparent" style={{scrollbarGutter: 'stable'}}>
            {messages.map((msg, i) => (
              <ChatMessageBubble
                key={i}
                sender={msg.sender}
                content={msg.content}
                time={msg.time}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
          <QuickActionsBar />
          <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
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
            <a href="/#" className="text-vino hover:underline font-semibold">Probá el modo Premium</a>
          </div>
        </div>
      </div>
    </div>
  );
} 