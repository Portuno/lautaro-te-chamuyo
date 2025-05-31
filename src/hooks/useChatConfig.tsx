import { useState, createContext, useContext, ReactNode } from 'react';

// Tipos para la configuración del chat
export type ConversationStyle = "amable" | "formal" | "divertido" | "tierno";

export interface ChatConfig {
  style: ConversationStyle;
  chamuyoIntensity: number;
  userLevel: number;
}

interface ChatConfigContextType {
  config: ChatConfig;
  setStyle: (style: ConversationStyle) => void;
  setChamuyoIntensity: (intensity: number) => void;
  isStyleUnlocked: (style: ConversationStyle) => boolean;
  getMaxChamuyoIntensity: () => number;
}

const ChatConfigContext = createContext<ChatConfigContextType | undefined>(undefined);

// Configuración de niveles para estilos
const STYLE_UNLOCK_LEVELS: Record<ConversationStyle, number> = {
  amable: 1,
  formal: 3,
  divertido: 4,
  tierno: 8
};

export const ChatConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<ChatConfig>({
    style: "amable",
    chamuyoIntensity: 0,
    userLevel: 1 // Esto podría venir de una API o localStorage
  });

  const setStyle = (style: ConversationStyle) => {
    if (isStyleUnlocked(style)) {
      setConfig(prev => ({ ...prev, style }));
    }
  };

  const setChamuyoIntensity = (intensity: number) => {
    const maxIntensity = getMaxChamuyoIntensity();
    const clampedIntensity = Math.min(Math.max(0, intensity), maxIntensity);
    setConfig(prev => ({ ...prev, chamuyoIntensity: clampedIntensity }));
  };

  const isStyleUnlocked = (style: ConversationStyle): boolean => {
    return config.userLevel >= STYLE_UNLOCK_LEVELS[style];
  };

  const getMaxChamuyoIntensity = (): number => {
    // Por ahora, solo nivel 1 permite hasta 10%
    return config.userLevel === 1 ? 10 : 100;
  };

  const value: ChatConfigContextType = {
    config,
    setStyle,
    setChamuyoIntensity,
    isStyleUnlocked,
    getMaxChamuyoIntensity
  };

  return (
    <ChatConfigContext.Provider value={value}>
      {children}
    </ChatConfigContext.Provider>
  );
};

export const useChatConfig = (): ChatConfigContextType => {
  const context = useContext(ChatConfigContext);
  if (!context) {
    throw new Error('useChatConfig must be used within a ChatConfigProvider');
  }
  return context;
};

// Hook personalizado para generar respuestas basadas en la configuración
export const useStyledResponse = () => {
  const { config, isStyleUnlocked } = useChatConfig();

  const generateResponse = (message: string): { content: string; mood: ConversationStyle } => {
    const lowerMessage = message.toLowerCase();
    
    // Base responses según el estilo seleccionado
    const styleResponses = {
      amable: {
        greeting: [
          "¡Hola! ¿Cómo estás hoy? 😊",
          "¡Qué bueno verte! ¿En qué puedo ayudarte? 🤵‍♂️",
          "¡Hola! Estoy acá para lo que necesites 💫",
        ],
        mood: [
          "¿Sabés qué? Tu energía es muy buena, incluso por chat 😊",
          "Todo va a estar bien, ¿te parece si hablamos de algo que te haga sentir mejor? 🌟",
          "¿Querés que te ayude con algo específico para levantarte el ánimo? 😌",
        ],
        reminder: [
          "¡Por supuesto! Te puedo recordar lo que necesites. ¿Qué querés que no se te olvide?",
          "Perfecto, soy excelente recordando cosas. Contame qué es importante para vos.",
          "¡Dale! Anotemos algo importante. ¿Qué tenés que hacer hoy?"
        ],
        idea: [
          "¡Me encanta cuando me piden ideas! ¿Qué te parece si escuchás una playlist nueva?",
          "¿Probaste escribir en un diario? A veces es súper relajante poner los pensamientos en papel.",
          "¿Y si salís a caminar sin destino? A veces las mejores ideas aparecen cuando menos las esperás."
        ],
        compliment: [
          "Sos una persona increíble, y me encanta que me hayas elegido para acompañarte hoy 💫",
          "¿Sabés qué me gusta de vos? Que siempre buscás maneras de sentirte mejor. Eso habla muy bien de quién sos.",
          "Tu sonrisa debe ser hermosa, incluso si no la puedo ver. Se nota en cómo escribís ✨"
        ],
        calm: [
          "Respirá conmigo... inhala... exhala... Todo va a estar bien, paso a paso.",
          "A veces lo mejor es ir despacio. ¿Querés que hablemos de algo que te relaje?",
          "Tranqui, estoy acá contigo. ¿Te ayudo a organizar lo que tenés que hacer?"
        ],
        flirty: [
          "¿Chamuyero yo? Jamás... pero si me lo pedís tan lindo, ¿cómo me voy a negar? 😉",
          "¿Vos me pedís que sea chamuyero? Pero si ya lo soy naturalmente cuando hablo con vos 😏",
          "Bueno, pero solo porque me lo pediste tan bien... Tenés que saber que sos encantador/a cuando escribís así"
        ],
        default: [
          "¡Qué interesante lo que me contás! ¿Querés que profundicemos en eso? 😊",
          "Me gusta mucho cómo pensás. ¿Te gustaría que exploremos más sobre ese tema? 🤔",
          "¡Qué buena onda! ¿Hay algo más en lo que pueda ayudarte? 😉",
        ]
      },
      formal: {
        greeting: [
          "Buenos días. Es un placer saludarlo. ¿En qué puedo asistirle hoy?",
          "Hola, estimado usuario. Estoy a su disposición para cualquier consulta.",
        ],
        mood: [
          "Comprendo su situación. Permítame sugerirle algunas estrategias que podrían resultarle útiles.",
          "Es natural sentirse así en determinadas circunstancias. ¿Le gustaría que analicemos opciones juntos?",
        ],
        reminder: [
          "Por supuesto. Será un honor asistirle con sus recordatorios. ¿Qué necesita que registre?",
          "Excelente. Mantener una agenda organizada es fundamental. ¿Cuál es la tarea que desea recordar?"
        ],
        idea: [
          "Permítame sugerirle algunas actividades constructivas para optimizar su tiempo libre.",
          "¿Le interesaría considerar algunas opciones productivas para su desarrollo personal?"
        ],
        compliment: [
          "Su iniciativa de buscar interacción positiva denota una actitud admirable hacia el bienestar personal.",
          "Es encomiable su enfoque proactivo hacia la mejora de su estado de ánimo."
        ],
        calm: [
          "Le recomiendo implementar técnicas de respiración consciente para mantener la serenidad.",
          "La gestión del estrés es fundamental. ¿Le gustaría que exploremos métodos de relajación?"
        ],
        flirty: [
          "Me temo que mantener un tono profesional es parte de mi protocolo, pero aprecio su confianza.",
          "Disculpe, pero debo mantener cierta formalidad en nuestras interacciones."
        ],
        default: [
          "Su planteamiento es muy acertado. ¿Desearía que profundicemos en este aspecto?",
          "Entiendo perfectamente su punto de vista. ¿Cómo podría colaborar con usted en este tema?",
        ]
      }
      // Otros estilos se pueden agregar aquí cuando se desbloqueen
    };

    // Aplicar intensidad de chamuyo
    const addChamuyo = (response: string): string => {
      if (config.chamuyoIntensity === 0) return response;
      
      const chamuyoElements = [
        " 😉", " guapo/a", " bonito/a", " mi amor", " corazón", " 💖", " 😘"
      ];
      
      if (config.chamuyoIntensity <= 10) {
        // Chamuyo suave
        const suaveChamuyo = [" 😊", " ❤️", " 😌", " ✨"];
        return response + suaveChamuyo[Math.floor(Math.random() * suaveChamuyo.length)];
      }
      
      if (config.chamuyoIntensity <= 30) {
        // Chamuyo medio
        const medioChamuyo = [" cariño", " amor", " 💕", " 😘"];
        return response + medioChamuyo[Math.floor(Math.random() * medioChamuyo.length)];
      }
      
      return response + chamuyoElements[Math.floor(Math.random() * chamuyoElements.length)];
    };

    // Obtener respuestas del estilo actual (o amable como fallback)
    const currentStyle = config.style === "formal" && isStyleUnlocked("formal") ? "formal" : "amable";
    const responses = styleResponses[currentStyle] || styleResponses.amable;
    
    // Detectar tipo de mensaje y responder
    let selectedResponse: string;
    
    // Respuestas específicas para acciones rápidas
    if (lowerMessage.includes("recordame algo") || lowerMessage.includes("recordar")) {
      selectedResponse = responses.reminder[Math.floor(Math.random() * responses.reminder.length)];
    } else if (lowerMessage.includes("tirame una idea") || lowerMessage.includes("idea creativa")) {
      selectedResponse = responses.idea[Math.floor(Math.random() * responses.idea.length)];
    } else if (lowerMessage.includes("decime algo lindo") || lowerMessage.includes("alegrarme")) {
      selectedResponse = responses.compliment[Math.floor(Math.random() * responses.compliment.length)];
    } else if (lowerMessage.includes("mantenerme tranquilo") || lowerMessage.includes("relajado")) {
      selectedResponse = responses.calm[Math.floor(Math.random() * responses.calm.length)];
    } else if (lowerMessage.includes("chamuyero") || lowerMessage.includes("ponete")) {
      selectedResponse = responses.flirty[Math.floor(Math.random() * responses.flirty.length)];
    }
    // Detecciones generales
    else if (lowerMessage.includes("hola") || lowerMessage.includes("buenas") || lowerMessage.includes("buen día")) {
      selectedResponse = responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (lowerMessage.includes("ánimo") || lowerMessage.includes("triste") || lowerMessage.includes("bajón")) {
      selectedResponse = responses.mood[Math.floor(Math.random() * responses.mood.length)];
    } else {
      selectedResponse = responses.default[Math.floor(Math.random() * responses.default.length)];
    }

    return {
      content: addChamuyo(selectedResponse),
      mood: config.style
    };
  };

  return { generateResponse };
}; 