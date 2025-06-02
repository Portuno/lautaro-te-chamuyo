// Fallback responses when Mabot is not available
export const FALLBACK_RESPONSES = {
  default: [
    "¡Me encantaría ayudarte con eso! Por ahora estoy en modo demo con funciones limitadas 🎯",
    "Disculpá, en modo demo no puedo hacer eso. ¡Pero podemos charlar de otras cosas! 😊",
    "En este momento tengo algunas limitaciones, pero igual podemos tener una linda charla 🌟",
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
    "¡Claro! Puedo:\n• Charlar con vos\n• Responder preguntas básicas\n• Darte algunas ideas y sugerencias\n\n¿De qué te gustaría hablar? 🤔",
    "¡Con gusto! Podemos:\n• Mantener una conversación\n• Compartir ideas y pensamientos\n• Ayudarte a pasar un buen rato\n\n¿Qué te gustaría hacer? ✨",
  ],
  ideas: [
    "¿Qué tal si probás aprender a tocar un instrumento nuevo? 🎸",
    "Podrías empezar un proyecto de jardinería en casa 🌱",
    "¿Y si organizás una noche de juegos con amigos? 🎲",
    "Podrías empezar a escribir un diario o blog personal 📝",
  ],
  motivation: [
    "¡Vas muy bien! Cada paso cuenta, seguí así 💪",
    "Recordá que sos capaz de lograr lo que te propongas ⭐",
    "A veces el camino es difícil, pero vale la pena seguir adelante 🌟",
  ],
  relax: [
    "Respirá profundo... Tomate un momento para vos 🌸",
    "Cerrá los ojos, escuchá tu música favorita y relajate 🎵",
    "A veces necesitamos un momento de paz. Está bien tomarse un descanso 🍃",
  ],
  flirty: [
    "¡Qué lindo momento compartiendo con vos! 😊",
    "Me encanta tu forma de ser, siempre tan interesante 🌟",
    "Tenés un no sé qué, que qué sé yo... 😏",
  ],
};

// Helper function to detect message intent
export const detectIntent = (message: string): keyof typeof FALLBACK_RESPONSES => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hola') || lowerMsg.includes('buenas') || lowerMsg.includes('buen día') || lowerMsg.includes('buenos días')) {
    return 'greetings';
  }
  
  if (lowerMsg.includes('mabot') || lowerMsg.includes('credencial') || lowerMsg.includes('configur') || lowerMsg.includes('premium')) {
    return 'mabot';
  }
  
  if (lowerMsg.includes('ayuda') || lowerMsg.includes('help') || lowerMsg.includes('qué podés') || lowerMsg.includes('que podes')) {
    return 'help';
  }

  if (lowerMsg.includes('idea') || lowerMsg.includes('creativ') || lowerMsg.includes('suger')) {
    return 'ideas';
  }

  if (lowerMsg.includes('animo') || lowerMsg.includes('motiva') || lowerMsg.includes('fuerza')) {
    return 'motivation';
  }

  if (lowerMsg.includes('tranquil') || lowerMsg.includes('relaj') || lowerMsg.includes('calma')) {
    return 'relax';
  }

  if (lowerMsg.includes('chamu') || lowerMsg.includes('lindo') || lowerMsg.includes('amor')) {
    return 'flirty';
  }
  
  return 'default';
};

// Helper function to get random response
export const getRandomResponse = (responses: string[]) => {
  return responses[Math.floor(Math.random() * responses.length)];
}; 