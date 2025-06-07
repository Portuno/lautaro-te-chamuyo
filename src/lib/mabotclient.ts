// mabotclient.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { UpdateInSchema, UpdateOutSchema, UpdateOut } from './update';
import { textMsg, fileMsg } from './message';

export interface MabotConfig {
  baseUrl: string;
  username: string;
  password: string;
  timeout?: number;
}

export class MabotError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'MabotError';
  }
}

export class AsyncMabotClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private readonly TOKEN_KEY = 'mabot_tokens';
  private readonly timeout: number;

  constructor(private config: MabotConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    this.timeout = config.timeout || 30000;
  }

  async loadToken(): Promise<void> {
    try {
      const data = localStorage.getItem(this.TOKEN_KEY);
      if (data) {
        const tokens = JSON.parse(data);
        this.accessToken = tokens.access_token || null;
        this.refreshToken = tokens.refresh_token || null;
        if (this.accessToken) {
          console.log('Token cargado de caché');
          // Verificar si el token es válido
          try {
            await this.getAuthHeaders();
            console.log('Token válido');
            return;
          } catch (e) {
            console.log('Token inválido, intentando refresh');
            if (this.refreshToken) {
              await this.refresh();
              return;
            }
          }
        }
      }
      // Si no hay token o es inválido, hacer login
      console.log('No hay token válido, iniciando login');
      await this.login();
    } catch (error) {
      console.error('Error al cargar token:', error);
      this.accessToken = null;
      this.refreshToken = null;
      await this.login();
    }
  }

  private async saveToken(): Promise<void> {
    const data = JSON.stringify({
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
    });
    try {
      localStorage.setItem(this.TOKEN_KEY, data);
      console.log('Token saved to cache.');
    } catch (e) {
      console.error('Error saving token:', e);
      throw new MabotError('Failed to save token to localStorage');
    }
  }

  private async login(): Promise<void> {
    const loginUrl = `${this.config.baseUrl}/auth/login`;
    console.log('Intentando login en:', loginUrl);
    console.log('Configuración del cliente:', {
      baseUrl: this.config.baseUrl,
      username: this.config.username ? 'presente' : 'ausente',
      password: this.config.password ? 'presente' : 'ausente',
      timeout: this.timeout
    });
    
    const params = new URLSearchParams({
      username: this.config.username,
      password: this.config.password,
      grant_type: 'password',
    });
    
    try {
      console.log('Enviando solicitud de login...');
      const response = await this.client.post(loginUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: this.timeout,
      });
      
      console.log('Respuesta de login recibida:', {
        status: response.status,
        statusText: response.statusText,
        hasAccessToken: !!response.data.access_token,
        hasRefreshToken: !!response.data.refresh_token
      });
      
      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      
      if (this.accessToken && this.refreshToken) {
        await this.saveToken();
        console.log('Login exitoso, tokens guardados');
      } else {
        console.error('Login fallido: no se recibieron tokens');
        throw new MabotError('No tokens received during login');
      }
    } catch (err) {
      console.error('Error en login:', err);
      if (err instanceof AxiosError) {
        console.error('Detalles del error Axios:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
          config: {
            url: err.config?.url,
            method: err.config?.method,
            headers: err.config?.headers,
            timeout: err.config?.timeout
          }
        });
        
        if (err.response?.status === 401) {
          throw new MabotError('Credenciales inválidas', 401);
        } else if (err.code === 'ECONNABORTED') {
          throw new MabotError('Tiempo de conexión agotado', 408);
        } else if (err.code === 'ERR_NETWORK') {
          throw new MabotError('Error de conexión - verifica tu conexión a internet', 0);
        } else {
          throw new MabotError(
            `Error en login: ${err.response?.data?.detail || err.message}`,
            err.response?.status
          );
        }
      } else {
        throw new MabotError(`Error en login: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  private async refresh(): Promise<void> {
    if (!this.refreshToken) {
      console.log('No hay refresh token, iniciando login');
      await this.login();
      return;
    }

    try {
      console.log('Intentando refresh token...');
      const url = `${this.config.baseUrl}/auth/refresh`;
      const response = await this.client.post(
        url,
        { refresh_token: this.refreshToken },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: this.timeout,
        }
      );

      console.log('Respuesta de refresh recibida:', {
        status: response.status,
        statusText: response.statusText,
        hasAccessToken: !!response.data.access_token,
        hasRefreshToken: !!response.data.refresh_token
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      
      if (this.accessToken && this.refreshToken) {
        await this.saveToken();
        console.log('Token refrescado exitosamente');
      } else {
        throw new MabotError('Failed to refresh tokens: missing token in response');
      }
    } catch (err) {
      console.error('Error al refrescar token:', err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          console.log('Refresh token inválido, iniciando login');
          this.accessToken = null;
          this.refreshToken = null;
          await this.login();
          return;
        }
        throw new MabotError(
          `Error al refrescar token: ${err.response?.data?.detail || err.message}`,
          err.response?.status
        );
      }
      throw new MabotError(`Error al refrescar token: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    if (!this.accessToken) {
      await this.loadToken();
    }
    return { Authorization: `Bearer ${this.accessToken}` };
  }

  private async getAuthHeadersJson(): Promise<Record<string, string>> {
    const headers = await this.getAuthHeaders();
    return { ...headers, 'Content-Type': 'application/json' };
  }

  async sendMessage(
    chatId: string,
    content: string | ArrayBuffer,
    options?: {
      bot_username?: string;
      filename?: string;
      mimetype?: string;
      caption?: string;
    }
  ): Promise<UpdateOut> {
    const url = `${this.config.baseUrl}/io/input`;
    const headers = await this.getAuthHeadersJson();
    let message;
    let payload;

    try {
      if (!options?.mimetype) {
        if (options?.caption) {
          throw new MabotError('A message cannot be of text type and have a caption');
        }
        message = textMsg('user', content.toString());
      } else {
        if (!options.filename) {
          throw new MabotError('Filename is required for file messages');
        }
        const base64Content = content instanceof ArrayBuffer
          ? btoa(String.fromCharCode(...new Uint8Array(content)))
          : btoa(content);
        message = fileMsg('user', options.filename, base64Content, options.mimetype, options.caption);
      }

      payload = UpdateInSchema.parse({
        platform: 'web',
        chat_id: chatId,
        messages: [message],
        bot_username: options?.bot_username || 'laubot'
      });
      
      console.log('Payload enviado:', payload);
      const response = await this.client.post(url, payload, { 
        headers, 
        timeout: this.timeout 
      });
      return UpdateOutSchema.parse(response.data) as UpdateOut;
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        const detail = err.response?.data?.detail;
        if (status === 401 && detail?.error === 'token_expired') {
          console.log('Access token expired, attempting to refresh token.');
          await this.refresh();
          const retryHeaders = await this.getAuthHeadersJson();
          const retryResp = await this.client.post(url, payload, { 
            headers: retryHeaders, 
            timeout: this.timeout 
          });
          return UpdateOutSchema.parse(retryResp.data) as UpdateOut;
        }
        throw new MabotError(
          `Failed to send message: ${detail || err.message}`,
          status
        );
      }
      if (err instanceof Error) {
        throw new MabotError(`Failed to send message: ${err.message}`);
      }
      throw new MabotError(`Failed to send message: ${String(err)}`);
    }
  }
} 