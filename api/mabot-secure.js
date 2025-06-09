// API proxy segura para MABOT
export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chatId, message, botUsername } = req.body;

  if (!chatId || !message) {
    return res.status(400).json({ error: 'chatId y message son requeridos' });
  }

  try {
    console.log('🔐 API Proxy: Procesando mensaje para MABOT');
    
    // Configuración usando variables de entorno del servidor (seguras)
    const baseUrl = process.env.MABOT_API_URL || process.env.VITE_API_BASE_URL || 'https://back.mapeima.space:8443';
    const username = process.env.MABOT_USERNAME;
    const password = process.env.MABOT_PASSWORD;

    if (!username || !password) {
      console.error('❌ Variables de entorno faltantes:', {
        baseUrl: !!baseUrl,
        username: !!username,
        password: !!password
      });
      return res.status(500).json({ 
        error: 'Configuración del servidor incompleta' 
      });
    }

    console.log('🔧 Configuración:', {
      baseUrl,
      username,
      password: '[PRESENTE]'
    });

    // Hacer login manual
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        username,
        password,
        grant_type: 'password'
      })
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.text();
      console.error('❌ Error en login:', loginResponse.status, errorData);
      return res.status(401).json({ 
        error: 'Error de autenticación con MABOT' 
      });
    }

    const tokens = await loginResponse.json();
    console.log('✅ Login exitoso');

    // Enviar mensaje
    const messagePayload = {
      platform: 'web',
      chat_id: chatId,
      messages: [{
        role: 'user',
        contents: [{
          type: 'text',
          value: message
        }]
      }],
      bot_username: botUsername || 'laubot'
    };

    const messageResponse = await fetch(`${baseUrl}/io/input`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access_token}`
      },
      body: JSON.stringify(messagePayload)
    });

    if (!messageResponse.ok) {
      const errorData = await messageResponse.text();
      console.error('❌ Error enviando mensaje:', messageResponse.status, errorData);
      return res.status(500).json({ 
        error: 'Error enviando mensaje a MABOT' 
      });
    }

    const response = await messageResponse.json();
    console.log('✅ Mensaje enviado exitosamente');

    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Error en API MABOT:', error);
    res.status(500).json({ 
      error: 'Error comunicando con MABOT',
      details: error.message 
    });
  }
} 