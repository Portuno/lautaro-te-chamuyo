# 🤖 Laubot - Tu Asistente Personal Inteligente

Un asistente personal con chamuyo que gestiona tu calendario, citas y vida digital con estilo y personalidad única.

## ✨ Características Principales

### 🎯 **Gestión Inteligente de Calendario**
- **Integración Google Calendar**: Conecta y sincroniza automáticamente con tu calendario
- **Creación de eventos**: Agenda citas con lenguaje natural ("mañana a las 3 pm con María")
- **Actualización automática**: Modifica eventos existentes sin complicaciones
- **Vista unificada**: Visualiza todos tus eventos en una interfaz limpia

### 💬 **Conversación con Chamuyo**
- **Personalidad única**: Interacciones naturales con ese toque especial de chamuyo
- **Estilos adaptativos**: Desde formal hasta divertido, según tu estado de ánimo
- **Contexto inteligente**: Recuerda conversaciones anteriores para continuidad
- **Respuestas personalizadas**: Se adapta a tu forma de comunicarte

### 🔐 **Autenticación Segura**
- **Sistema completo**: Registro, login y recuperación de contraseña
- **Perfiles personalizados**: Cada usuario tiene su experiencia única
- **Datos protegidos**: Información personal y calendario completamente seguros
- **Sesiones persistentes**: Mantiene tu sesión activa de forma segura

### 📊 **Sistema de Progreso**
- **Nivel de chamuyo**: Desarrolla tu habilidad conversacional
- **Puntos de actividad**: Gana puntos por interacciones y uso del calendario
- **Historial completo**: Revisa todas tus conversaciones y eventos

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase (para base de datos)
- Google Calendar API (opcional)

### Configuración

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/laubot.git
cd laubot
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus credenciales:
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_anonima
```

4. **Iniciar desarrollo**
```bash
npm run dev
```

## 🎨 Tecnologías

**Frontend**
- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **TailwindCSS** - Estilos modernos
- **Lucide React** - Iconografía elegante

**Backend & Base de Datos**
- **Supabase** - Backend como servicio
- **PostgreSQL** - Base de datos relacional
- **Row Level Security** - Seguridad a nivel de fila

**APIs Externas**
- **Google Calendar API** - Gestión de calendario
- **REST APIs** - Integración sin dependencias de Node.js

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── AuthModal.tsx   # Modal de autenticación
│   └── ...
├── hooks/              # Hooks personalizados
│   ├── useAuth.tsx     # Gestión de autenticación
│   ├── useLaubot.tsx   # Lógica principal del bot
│   └── ...
├── lib/                # Utilidades y servicios
│   ├── supabase.ts     # Cliente de Supabase
│   ├── laubot.ts       # Máquina de estados del bot
│   └── ...
├── pages/              # Páginas principales
│   ├── Index.tsx       # Landing page
│   ├── Chat.tsx        # Interfaz de chat
│   └── ...
└── types/              # Definiciones de tipos
```

## 🔧 Configuración de Base de Datos

### Supabase Setup

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el SQL schema:

```sql
-- Perfiles de usuario
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  chamuyo_level INTEGER DEFAULT 1,
  total_points INTEGER DEFAULT 0,
  subscription_status TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eventos de calendario
CREATE TABLE calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  google_event_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversaciones y mensajes
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')),
  chamuyo_intensity INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 Casos de Uso

### 📅 **Gestión de Calendario**
```
Usuario: "Agendame una reunión con el equipo mañana a las 2"
Laubot: "¡Dale! Te agendo la reunión con el equipo para mañana a las 14:00. ¿Algún detalle más que quieras agregar?"
```

### 💭 **Conversación Natural**
```
Usuario: "¿Cómo está mi semana?"
Laubot: "Mirá, tenés bastante movimiento: 3 reuniones, 2 citas médicas y ese asado del viernes que no te podés perder 😉"
```

### 🔄 **Modificación de Eventos**
```
Usuario: "Cambia la reunión de mañana para las 4"
Laubot: "Listo, moví tu reunión para las 16:00. Ya está actualizada en tu calendario."
```

## 🌟 Funcionalidades Avanzadas

- **Estado de conversación persistente**: El bot recuerda el contexto
- **Múltiples estilos**: Formal, amable, divertido, según la situación
- **Integración automática**: Sincronización bidireccional con Google Calendar
- **Responsive design**: Funciona perfecto en mobile y desktop
- **Modo offline**: Funcionalidad básica sin conexión

## 🔐 Seguridad

- **Autenticación JWT** con Supabase
- **Row Level Security** en todas las tablas
- **Variables de entorno** para credenciales sensibles
- **HTTPS obligatorio** en producción
- **Validación** tanto frontend como backend

## 🚦 Estados del Bot

1. **Idle**: Esperando instrucciones
2. **Authenticating**: Verificando credenciales de Google
3. **Authenticated**: Listo para gestionar calendario
4. **Listing Events**: Consultando eventos existentes
5. **Creating Event**: Creando nuevo evento
6. **Updating Event**: Modificando evento existente

## 📱 Deploy

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm run preview
```

### Deploy en Vercel/Netlify
1. Conecta tu repositorio
2. Configura las variables de entorno
3. Deploy automático en cada push

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**¿Necesitás ayuda?** Abrí un issue o contactanos directamente. ¡Laubot está acá para hacer tu vida más fácil! 🚀 