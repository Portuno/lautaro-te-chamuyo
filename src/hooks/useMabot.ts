import { useState, useCallback, useRef } from 'react';
import { AsyncMabotClient, MabotConfig, MabotError } from '../lib/mabotclient';
import { API_BASE_URL } from '../config';

interface UseMabotOptions {
  username?: string;
  password?: string;
  baseUrl?: string;
}

export const useMabot = (options?: UseMabotOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const clientRef = useRef<AsyncMabotClient | null>(null);

  const getCredentials = useCallback((): { username: string; password: string; baseUrl: string; isValid: boolean } => {
    console.log('🔍 getCredentials: Verificando variables de entorno...');
    console.log('🔍 Raw env vars:', {
      VITE_MABOT_USERNAME: import.meta.env.VITE_MABOT_USERNAME,
      VITE_MABOT_PASSWORD: import.meta.env.VITE_MABOT_PASSWORD ? '[PRESENTE]' : '[AUSENTE]',
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL
    });
    
    // Prioridad: opciones pasadas > variables de entorno > valores por defecto
    const username = options?.username || 
                    import.meta.env.VITE_MABOT_USERNAME || 
                    '';
    
    const password = options?.password || 
                    import.meta.env.VITE_MABOT_PASSWORD || 
                    '';
    
    const baseUrl = options?.baseUrl || 
                   import.meta.env.VITE_API_BASE_URL ||
                   API_BASE_URL;

    console.log('🔍 getCredentials: Valores obtenidos:', {
      username,
      password: password ? '[PRESENTE]' : '[AUSENTE]',
      baseUrl,
      usernameLength: username?.length || 0,
      passwordLength: password?.length || 0
    });

    // Verificar si tenemos credenciales válidas
    const isValid = username && password && username !== 'demo' && password !== 'demo';
    
    console.log('🔍 getCredentials: Validación:', {
      hasUsername: !!username,
      hasPassword: !!password,
      usernameNotDemo: username !== 'demo',
      passwordNotDemo: password !== 'demo',
      isValid
    });

    return { username: username || 'demo', password: password || 'demo', baseUrl, isValid };
  }, [options]);

  const initializeClient = useCallback(async () => {
    console.log('🔧 initializeClient iniciado');
    
    if (clientRef.current) {
      console.log('✅ Cliente ya existe, reutilizando');
      return clientRef.current;
    }

    try {
      console.log('⏳ Inicializando nuevo cliente...');
      setIsLoading(true);
      setError(null);

      const { username, password, baseUrl, isValid } = getCredentials();
      
      if (!isValid) {
        console.error('❌ Credenciales no válidas en initializeClient');
        throw new MabotError('Credenciales de MABOT no configuradas', 401, 'NO_CREDENTIALS');
      }
      
      console.log('🔧 Configuración del cliente MABOT:', {
        baseUrl,
        username: username ? 'presente' : 'ausente',
        password: password ? 'presente' : 'ausente',
        fromEnv: {
          VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL ? 'presente' : 'ausente',
          VITE_MABOT_USERNAME: import.meta.env.VITE_MABOT_USERNAME ? 'presente' : 'ausente',
          VITE_MABOT_PASSWORD: import.meta.env.VITE_MABOT_PASSWORD ? 'presente' : 'ausente'
        }
      });

      const config: MabotConfig = {
        baseUrl,
        username,
        password,
        timeout: 30000
      };

      console.log('🏗️ Creando AsyncMabotClient...');
      const client = new AsyncMabotClient(config);
      
      console.log('🔑 Cargando token...');
      await client.loadToken();
      
      clientRef.current = client;
      setIsConnected(true);
      setIsLoading(false);
      
      console.log('✅ Cliente MABOT inicializado exitosamente');
      return client;
    } catch (err) {
      console.error('❌ Error inicializando cliente MABOT:', err);
      console.error('📋 Detalles del error de inicialización:', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        status: err instanceof MabotError ? err.status : 'N/A',
        code: err instanceof MabotError ? err.code : 'N/A'
      });
      
      setError(err instanceof MabotError ? err.message : 'Error de conexión con MABOT');
      setIsConnected(false);
      setIsLoading(false);
      throw err;
    }
  }, [getCredentials]);

  const sendMessage = useCallback(async (chatId: string, message: string, botUsername?: string) => {
    console.log('🚀 useMabot.sendMessage iniciado:', { chatId, message: message.substring(0, 50) + '...', botUsername });
    
    // Verificar si tenemos credenciales válidas antes de intentar conectar
    const { isValid, username, password, baseUrl } = getCredentials();
    console.log('🔑 Verificación de credenciales:', { isValid, username, password: password ? '[PRESENTE]' : '[AUSENTE]', baseUrl });
    
    if (!isValid) {
      console.error('❌ Credenciales de MABOT no válidas');
      const error = new MabotError('Credenciales de MABOT no configuradas', 401, 'NO_CREDENTIALS');
      setError('Credenciales de MABOT no configuradas');
      throw error;
    }

    try {
      console.log('⏳ Iniciando envío de mensaje a MABOT...');
      setIsLoading(true);
      setError(null);

      const client = clientRef.current || await initializeClient();
      console.log('📡 Cliente obtenido, enviando mensaje...');
      
      const response = await client.sendMessage(chatId, message, {
        bot_username: botUsername || 'laubot'
      });

      console.log('✅ Respuesta recibida de MABOT:', response);
      setIsLoading(false);
      return response;
    } catch (err) {
      console.error('❌ Error enviando mensaje a MABOT:', err);
      console.error('📋 Detalles del error:', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        status: err instanceof MabotError ? err.status : 'N/A',
        code: err instanceof MabotError ? err.code : 'N/A'
      });
      
      setError(err instanceof MabotError ? err.message : 'Error enviando mensaje');
      setIsLoading(false);
      
      // Si es error de autenticación, resetear el cliente para forzar re-login
      if (err instanceof MabotError && err.status === 401) {
        console.log('🔄 Error 401 detectado, reseteando cliente...');
        clientRef.current = null;
        setIsConnected(false);
      }
      
      throw err;
    }
  }, [initializeClient, getCredentials]);

  const disconnect = useCallback(() => {
    clientRef.current = null;
    setIsConnected(false);
    setError(null);
  }, []);

  return {
    isConnected,
    isLoading,
    error,
    sendMessage,
    initializeClient,
    disconnect
  };
}; 