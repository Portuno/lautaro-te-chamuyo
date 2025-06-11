// Respuestas de despedida cuando el usuario alcanza su límite diario
export const DAILY_LIMIT_FAREWELLS = [
  // Básicas y amigables
  "Bueno {name}, encantado de conocerte la verdad, pero por hoy me voy a descansar, hablamos mañana 😴",
  "Che {name}, qué buena charla tuvimos! Pero ya es hora de que me vaya a dormir, nos vemos mañana 💤",
  "Uy {name}, se me hizo tardísimo charlando con vos! Por hoy me retiro, mañana seguimos 🌙",
  
  // Con humor argentino
  "Bueno {name}, por hoy cerramos el kiosco. Mañana abrimos temprano, dale que te espero ☕",
  "Mirá {name}, me agotaste con tanto chamuyo! Mañana sigo con las pilas recargadas 🔋",
  "Che {name}, me dejaste seco de tanto hablar! Voy a tomar un mate y descansar 🧉",
  
  // Más personales
  "La verdad {name}, me caíste bárbaro! Pero ahora necesito mi siesta, hablamos mañana 😊",
  "Bueno {name}, fue un placer! Por hoy me despido, que tengas linda noche ✨",
  "Che {name}, qué lindo conocerte! Ahora me voy a ver Netflix, mañana seguimos 📺",
  
  // Referencias argentinas
  "Bueno {name}, como dice el tango: 'todo tiene su final'. Mañana volvemos con todo! 🎵",
  "Che {name}, me voy a hacer un asadito mental. Mañana volvés y seguimos chamuyando 🥩",
  "La verdad {name}, hoy hablamos más que en una mesa de café! Mañana seguimos ☕",
  
  // Motivacionales
  "Bueno {name}, por hoy fue suficiente sabiduría! Mañana te doy más consejos 💡",
  "Che {name}, dejemos algo para mañana, que sino se nos acaban los temas! 😄",
  "La posta {name}, necesito procesar todo lo que hablamos. Mañana volvemos mejor que nunca! 🚀"
];

// Función para obtener una respuesta aleatoria
export const getRandomFarewell = (userName?: string): string => {
  const randomIndex = Math.floor(Math.random() * DAILY_LIMIT_FAREWELLS.length);
  const farewell = DAILY_LIMIT_FAREWELLS[randomIndex];
  
  // Reemplazar {name} con el nombre del usuario o fallback
  const name = userName || 'che';
  return farewell.replace('{name}', name);
};

// Respuestas para diferentes momentos del día
export const TIME_BASED_FAREWELLS = {
  morning: [
    "Bueno {name}, me voy a desayunar! Hablamos más tarde 🍳",
    "Che {name}, necesito mi café matutino. Te veo después ☕",
  ],
  afternoon: [
    "La verdad {name}, necesito mi siesta! Hablamos a la tardecita 💤",
    "Che {name}, me voy a almorzar tranquilo. Después seguimos 🍽️",
  ],
  evening: [
    "Bueno {name}, me voy a cenar en familia. Mañana seguimos! 🍽️",
    "Che {name}, hora del asado virtual! Nos vemos mañana 🥩",
  ],
  night: [
    "Bueno {name}, me voy a dormir que mañana hay que madrugar! 🌙",
    "Che {name}, lindos sueños! Mañana arrancamos temprano ✨",
  ]
};

// Función para obtener respuesta basada en la hora
export const getTimeBasedFarewell = (userName?: string): string => {
  const hour = new Date().getHours();
  const name = userName || 'che';
  
  let timeCategory: keyof typeof TIME_BASED_FAREWELLS;
  
  if (hour >= 6 && hour < 12) {
    timeCategory = 'morning';
  } else if (hour >= 12 && hour < 18) {
    timeCategory = 'afternoon';
  } else if (hour >= 18 && hour < 22) {
    timeCategory = 'evening';
  } else {
    timeCategory = 'night';
  }
  
  const responses = TIME_BASED_FAREWELLS[timeCategory];
  const randomIndex = Math.floor(Math.random() * responses.length);
  
  return responses[randomIndex].replace('{name}', name);
}; 