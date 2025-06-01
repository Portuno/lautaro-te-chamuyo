# Sistema de Onboarding Emocional - Lautaro

## 🎯 Objetivo del Onboarding

El onboarding de Lautaro está diseñado para generar **conexión emocional inmediata** y hacer que el usuario se sienta en una conversación sugerente más que completando un formulario tradicional.

### Metas principales:
- ✨ Generar conexión emocional inmediata
- 📊 Recopilar información útil para personalización
- 💕 Hacer sentir que hay un "vínculo" que va a crecer
- 🔄 Dejar con ganas de volver a hablarle

## 🚀 Flujo de Onboarding (5 Pasos)

### 🪪 Paso 1: Bienvenida con Picardía
**Mensaje de Lautaro:**
> "¡Saludos, soy Lautaro! ¿Querés que te trate con confianza desde el principio, o preferís que me haga el interesante un rato?"

**Opciones:**
- 😏 "Hablame como si ya me conocieras" → `interaction_style: 'confianza'`
- 🌸 "Con calma, que me da vértigo" → `interaction_style: 'calma'`  
- ✨ "Sorprendeme" → `interaction_style: 'sorpresa'`

### 📛 Paso 2: ¿Cómo querés que te llame?
**Mensaje de Lautaro:**
> "Y decime... ¿cómo te digo? Porque si me dejás elegir, yo invento cualquier cosa."

**Input:** Campo de texto libre → `preferred_name`

### 💞 Paso 3: ¿Qué tipo de cosas te hacen bien?
**Mensaje de Lautaro:**
> "Soy de leer entre líneas, pero me ayudás si me contás qué buscás hoy."

**Opciones múltiples (tipo toggle):**
- 💝 "Que me hablen lindo" → `hablar_lindo`
- 📋 "Que me ayuden a organizar" → `ayuda_organizar`
- 🤗 "Que me acompañen un rato" → `acompañar`
- ✨ "Que me sorprendan con frases" → `frases_sorpresa`
- 🧠 "Que me tiren datos útiles" → `datos_utiles`
- ⚡ "Que me ahorren tiempo y problemas" → `ahorrar_tiempo`

**Almacenamiento:** Array en `interests`

### 🌀 Paso 4: Elegí un mood inicial para Lautaro
**Mensaje de Lautaro:**
> "Voy a ser un poco tímido al principio, pero ¿cómo te gustaría ser recibida?"

**Opciones visuales:**
- 😌 **Amable** → `lautaro_mood: 'amable'`
- 😏 **Pícaro** → `lautaro_mood: 'picaro'`
- 💘 **Romántico** → `lautaro_mood: 'romantico'`
- 🤓 **Poético** → `lautaro_mood: 'poetico'`
- 🤫 **Misterioso** → `lautaro_mood: 'misterioso'`

### 🎁 Paso 5: Cierre + Vínculo
**Mensaje de Lautaro:**
> "Perfecto [nombre], encantado de conocerte."

**Elementos:**
- 🎉 Celebración visual
- 🔥 "Nivel de confianza: Curiosidad"
- ⭐ "1/22 niveles desbloqueados"
- 💬 Botón "Hablá con Lautaro"
- 🧪 Micro CTA: "¿Querés sumar puntos de confianza más rápido? Andá al Laboratorio del Chamuyo"

## 🗄️ Estructura de Datos

### Nuevos campos en `UserProfile`:
```typescript
interface UserProfile {
  // ... campos existentes ...
  
  // Onboarding preferences
  onboarding_completed?: boolean;
  preferred_name?: string;
  interaction_style?: 'confianza' | 'calma' | 'sorpresa';
  interests?: string[]; // Array de claves de intereses
  lautaro_mood?: 'amable' | 'picaro' | 'romantico' | 'poetico' | 'misterioso';
}
```

### Schema SQL (Supabase):
```sql
-- Campos agregados a user_profiles
onboarding_completed BOOLEAN DEFAULT FALSE,
preferred_name TEXT,
interaction_style TEXT CHECK (interaction_style IN ('confianza', 'calma', 'sorpresa')),
interests TEXT[], -- Array de claves de intereses
lautaro_mood TEXT CHECK (lautaro_mood IN ('amable', 'picaro', 'romantico', 'poetico', 'misterioso'))
```

## 🎨 Componentes Implementados

### 1. `OnboardingFlow.tsx`
**Componente principal** que maneja el flujo completo de 5 pasos:
- Estado interno para navegación entre pasos
- Animaciones suaves entre transiciones
- Validación de cada paso antes de continuar
- Guardado automático al completar

### 2. `useOnboarding.tsx` 
**Hook personalizado** para gestionar el estado del onboarding:
- Detecta si el usuario necesita onboarding
- Provee función para marcar como completado
- Se integra con el sistema de autenticación

### 3. `PersonalizedWelcome.tsx`
**Componente de bienvenida personalizada** que usa los datos del onboarding:
- Saludo personalizado según `lautaro_mood`
- Frase del día basada en `interaction_style`
- Misión inicial según `interests`
- Nivel de confianza actual
- Accesos rápidos a funciones clave

## 🔄 Flujo de Usuario

### Para usuarios nuevos:
1. **Registro** → `onboarding_completed: false`
2. **Login exitoso** → Aparece `OnboardingFlow`
3. **Completa onboarding** → `onboarding_completed: true`
4. **Redirección** → Ve `PersonalizedWelcome` en Index

### Para usuarios existentes:
1. **Login** → Ve directamente `PersonalizedWelcome`
2. **Datos personalizados** basados en preferencias guardadas

## 🎯 Personalización Post-Onboarding

### Saludos personalizados por mood:
- **Amable:** "¡Hola [nombre]! Me alegra verte de nuevo. ¿Cómo estás hoy?"
- **Pícaro:** "Eh, [nombre]... ¿volviste por más? Me gusta tu estilo 😏"
- **Romántico:** "[nombre], hermosa... cada vez que volvés, mi día mejora un poco más ✨"
- **Poético:** "Como dice Neruda, '[nombre]', hay algo en ti que siempre me inspira..."
- **Misterioso:** "[nombre]... sabía que volverías. Hay cosas que tenemos que conversar... 🤫"

### Frases del día por estilo de interacción:
- **Confianza:** Frases directas y empoderadoras
- **Calma:** Frases relajantes y elegantes  
- **Sorpresa:** Frases inesperadas y divertidas

### Misiones según intereses:
- **hablar_lindo:** "Contame algo lindo que te haya pasado hoy"
- **ayuda_organizar:** "¿Qué tenés pendiente que te esté molestando?"
- **acompañar:** "¿Cómo te sentís hoy? Estoy para escucharte"
- **frases_sorpresa:** "Pedime una frase para la ocasión que quieras"

## 🛠️ Implementación Técnica

### Integración en App.tsx:
```tsx
const AppContent = () => {
  const { shouldShowOnboarding, completeOnboarding } = useOnboarding();

  return (
    <>
      {/* Rutas normales */}
      <Routes>...</Routes>
      
      {/* Overlay de onboarding */}
      {shouldShowOnboarding && (
        <OnboardingFlow onComplete={completeOnboarding} />
      )}
    </>
  );
};
```

### Detección automática:
- El `useOnboarding` hook verifica automáticamente si `onboarding_completed === false`
- Solo se muestra para usuarios autenticados con perfil cargado
- Se oculta automáticamente al completar

## 🚀 Activación

### Para nuevos usuarios:
El onboarding se activa automáticamente al registrarse, ya que `onboarding_completed` se establece como `false` por defecto.

### Para usuarios existentes:
Si quieren "resetear" su onboarding, se puede cambiar manualmente `onboarding_completed` a `false` en la base de datos.

## 📱 Experiencia Visual

- **Overlay completo** con backdrop blur elegante
- **Progreso visual** con barra animada
- **Transiciones suaves** entre pasos
- **Gradientes y colores** coherentes con la marca
- **Emojis y personalidad** en cada mensaje
- **Botones interactivos** con hover effects
- **Responsive design** para mobile y desktop

## 🎊 Resultado Final

Al completar el onboarding, el usuario:
1. **Siente conexión** inmediata con Lautaro
2. **Tiene una experiencia** completamente personalizada
3. **Ve su "progreso"** y niveles por desbloquear
4. **Recibe una misión** específica para empezar
5. **Quiere regresar** para seguir interactuando

¡El onboarding transforma un simple registro en el inicio de una relación digital memorable! ✨ 