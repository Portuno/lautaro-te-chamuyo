// Fallback responses when Mabot is not available
export const FALLBACK_RESPONSES = {
  default: [
    "¡Hola! Estoy en modo demo. Para una experiencia completa, podés conectarme con Mabot visitando mabot.app 🚀",
    "¡Qué buena onda! En este modo demo tengo respuestas limitadas, pero podés desbloquear todo mi potencial en mabot.app 🎯",
    "Me encanta charlar! Para tener conversaciones más profundas, conectame con Mabot en mabot.app 🌟",
  ],
  greetings: [
    "¡Hola! ¿Cómo andás? 👋",
    "¡Buenas! ¿Todo bien? 😊",
    "¡Qué bueno verte por acá! 🎉",
  ],
  mabot: [
    "¡Ah, Mabot! Es mi cerebro principal. Podés conocer más visitando <a href='https://mabot.app' target='_blank' class='text-vino hover:underline font-semibold'>mabot.app</a> 🧠",
    "Para configurar mis credenciales, visitá <a href='https://mabot.app' target='_blank' class='text-vino hover:underline font-semibold'>mabot.app</a> y seguí las instrucciones 🔧",
    "¡Todo sobre Mabot lo encontrás en <a href='https://mabot.app' target='_blank' class='text-vino hover:underline font-semibold'>mabot.app</a>! 🌟",
  ],
  help: [
    "¡Claro! En modo demo puedo:\n• Responder saludos\n• Darte info sobre Mabot\n• Charlar básicamente\n\nPara más funciones, conectame con Mabot 🚀",
    "Puedo ayudarte con:\n• Conversación básica\n• Info sobre Mabot\n• Respuestas predefinidas\n\n¡Y mucho más cuando me conectes con Mabot! ✨",
  ],
};

// Helper function to detect message intent
export const detectIntent = (message: string): keyof typeof FALLBACK_RESPONSES => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hola') || lowerMsg.includes('buenas') || lowerMsg.includes('buen día') || lowerMsg.includes('buenos días')) {
    return 'greetings';
  }
  
  if (lowerMsg.includes('mabot') || lowerMsg.includes('credencial') || lowerMsg.includes('configur')) {
    return 'mabot';
  }
  
  if (lowerMsg.includes('ayuda') || lowerMsg.includes('help') || lowerMsg.includes('qué podés') || lowerMsg.includes('que podes')) {
    return 'help';
  }
  
  return 'default';
};

// Helper function to get random response
export const getRandomResponse = (responses: string[]) => {
  return responses[Math.floor(Math.random() * responses.length)];
}; 