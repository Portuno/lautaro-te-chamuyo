# 🚀 Integración Completa: Laubot + Supabase

Sistema completo de asistente personal con autenticación, persistencia de datos y sincronización de calendario.

## ✅ Características Implementadas

### 🔐 **Autenticación Completa**
- **Login/Registro** con email y contraseña
- **OAuth con Google** para fácil acceso
- **Gestión de perfiles** de usuario automática
- **Row Level Security (RLS)** para protección de datos
- **Recuperación de contraseña** via email

### 🤖 **Bot Inteligente Persistente**
- **Estados guardados** en Supabase en tiempo real
- **Credenciales de Google** almacenadas de forma segura
- **Sincronización automática** entre sesiones
- **Manejo de errores** con recuperación automática

### 📅 **Calendario Integrado**
- **Sincronización bidireccional** con Google Calendar
- **Persistencia local** en Supabase
- **CRUD completo** de eventos
- **Sincronización manual** o automática

## 🗄️ **Esquema de Base de Datos**

### Tablas Principales:

1. **`user_profiles`** - Perfiles de usuario
   - Niveles de chamuyo, puntos, suscripción
   - Información personal y configuraciones

2. **`calendar_events`** - Eventos sincronizados
   - Datos completos del evento
   - Referencia a Google Calendar ID
   - Estados y metadata

3. **`bot_sessions`** - Estados del bot
   - Estado actual de la máquina
   - Contexto serializado
   - Credenciales de Google (encriptadas)

4. **`conversations`** - Historial de chats
   - Conversaciones persistentes
   - Contadores de mensajes

5. **`chat_messages`** - Mensajes individuales
   - Contenido completo
   - Estilos y configuraciones
   - Metadata del chamuyo

## 🔧 **Configuración Inicial**

### 1. Configurar Supabase

1. **Crear proyecto** en [supabase.com](https://supabase.com)
2. **Ejecutar SQL** del archivo `supabase-schema.sql`
3. **Configurar OAuth** de Google en Authentication > Providers
4. **Obtener credenciales** del proyecto

### 2. Variables de Entorno

Crear archivo `.env.local`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Opcional - para Google Calendar
VITE_GOOGLE_CLIENT_ID=tu-google-client-id
VITE_GOOGLE_CLIENT_SECRET=tu-google-client-secret
VITE_GOOGLE_REDIRECT_URI=http://localhost:8080/auth/callback
```

### 3. Configurar Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto y habilitar Calendar API
3. Configurar OAuth consent screen
4. Crear credenciales OAuth 2.0
5. Agregar URLs autorizadas:
   - `http://localhost:8080`
   - `https://tu-proyecto.supabase.co`

## 🎯 **Rutas de la Aplicación**

### **`/dashboard`** - Dashboard Principal
- **Autenticación requerida**
- Panel completo del usuario
- Control del bot y calendario
- Estadísticas en tiempo real

### **`/laubot`** - Demo del Bot
- Demostración sin autenticación
- Funcionalidades básicas
- Modo desarrollo con datos mock

### **`/chat`** - Chat Interactivo
- Sistema de chat con estilos
- Integración con configuraciones del usuario

## 📱 **Uso del Sistema**

### Autenticación
```tsx
import { useAuth } from './hooks/useAuth';

const MyComponent = () => {
  const { 
    user, 
    profile, 
    isAuthenticated, 
    signIn, 
    signUp, 
    signInWithGoogle,
    signOut 
  } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>¡Hola, {profile?.full_name}!</h1>
          <button onClick={signOut}>Cerrar sesión</button>
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Login con Google</button>
      )}
    </div>
  );
};
```

### Bot con Persistencia
```tsx
import { useLaubot } from './hooks/useLaubot';
import { supabaseLaubotService } from './lib/supabaseLaubotService';

const BotComponent = () => {
  const { 
    isLoading, 
    authenticate, 
    listEvents, 
    createEvent 
  } = useLaubot();

  const handleSync = async () => {
    const result = await supabaseLaubotService.syncCalendarEvents();
    if (result.success) {
      console.log('Sincronización exitosa');
    }
  };

  return (
    <div>
      <button onClick={authenticate}>Autenticar</button>
      <button onClick={listEvents}>Ver Eventos</button>
      <button onClick={handleSync}>Sincronizar</button>
    </div>
  );
};
```

### Gestión de Eventos
```tsx
import { supabaseLaubotService } from './lib/supabaseLaubotService';

// Crear evento
const createEvent = async () => {
  const event = {
    summary: 'Mi evento',
    start: { dateTime: '2024-01-20T10:00:00Z' },
    end: { dateTime: '2024-01-20T11:00:00Z' }
  };

  const result = await supabaseLaubotService.createCalendarEvent(event);
  console.log(result);
};

// Obtener eventos
const getEvents = async () => {
  const result = await supabaseLaubotService.getCalendarEvents(10);
  console.log(result.events);
};
```

## 🔒 **Seguridad**

### Row Level Security (RLS)
- Todos los datos están protegidos por RLS
- Los usuarios solo pueden acceder a sus propios datos
- Políticas automáticas configuradas

### Autenticación
- Tokens JWT seguros de Supabase
- Refresh automático de sesiones
- Protección CSRF integrada

### Credenciales de Google
- Almacenadas de forma encriptada en JSONB
- Acceso restringido por usuario
- Refresh automático de tokens

## 🚀 **Comandos de Desarrollo**

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Verificar tipos
npm run type-check
```

## 📊 **Características del Dashboard**

### **Panel de Usuario**
- Avatar y información del perfil
- Nivel de chamuyo y puntos
- Estado de suscripción
- Configuraciones rápidas

### **Panel del Bot**
- Estado en tiempo real
- Controles de autenticación
- Creación rápida de eventos
- Lista de eventos recientes

### **Panel de Calendario**
- Eventos sincronizados
- Botón de sincronización manual
- Detalles completos de eventos
- Estados y ubicaciones

### **Estadísticas**
- Eventos guardados
- Nivel actual
- Puntos totales
- Estado de suscripción

## 🔄 **Flujo de Sincronización**

1. **Usuario se autentica** → Perfil cargado automáticamente
2. **Bot se autentica** → Credenciales guardadas en Supabase
3. **Eventos sincronizados** → Google Calendar ↔ Supabase
4. **Estados persistentes** → Bot mantiene estado entre sesiones
5. **Datos en tiempo real** → Actualizaciones automáticas

## 🎨 **Personalización**

### Temas y Estilos
- Variables CSS personalizables
- Colores del tema Lautaro (vino, beige, sand)
- Componentes responsivos

### Configuraciones de Usuario
- Nivel de chamuyo personalizable
- Estilos de conversación
- Preferencias de sincronización

## 🐛 **Depuración**

### Desarrollo
- Logs detallados en consola
- Estados del bot visibles
- Datos mock para pruebas

### Producción
- Error handling completo
- Fallbacks para APIs
- Estados de carga apropiados

---

## 🎯 **Próximos Pasos**

1. **Notificaciones** push para eventos
2. **Integración con más APIs** (Gmail, Drive, etc.)
3. **Chat en tiempo real** con WebSockets
4. **Analytics** de uso del bot
5. **Marketplace** de plugins

¡El sistema está completamente funcional y listo para producción! 🚀 