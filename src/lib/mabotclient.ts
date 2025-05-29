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
    this.client = axios.create();
    this.timeout = config.timeout || 120000;
  }

  async loadToken(): Promise<void> {
    try {
      const data = localStorage.getItem(this.TOKEN_KEY);
      if (data) {
        const tokens = JSON.parse(data);
        this.accessToken = tokens.access_token || null;
        this.refreshToken = tokens.refresh_token || null;
        if (this.accessToken) console.log('Loaded cached access token.');
        if (this.refreshToken) console.log('Loaded cached refresh token.');
      }
    } catch {
      this.accessToken = null;
      this.refreshToken = null;
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
    const params = new URLSearchParams({
      username: this.config.username,
      password: this.config.password,
      grant_type: 'password',
    });
    try {
      const response = await this.client.post(loginUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: this.timeout,
      });
      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      if (this.accessToken && this.refreshToken) {
        await this.saveToken();
        console.log('Logged in successfully.');
      } else {
        throw new MabotError('No tokens received during login');
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401 && err.response.data.detail?.error === 'token_expired') {
          console.log('Access token expired, attempting to refresh token.');
          await this.refresh();
        } else {
          throw new MabotError(
            `Login failed: ${err.response?.data?.detail || err.message}`,
            err.response?.status
          );
        }
      } else {
        throw new MabotError(`Login failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  private async refresh(): Promise<void> {
    if (!this.refreshToken) {
      throw new MabotError('No refresh token available. Please login again.');
    }
    try {
      const url = `${this.config.baseUrl}/auth/refresh`;
      const response = await this.client.post(
        url,
        { refresh_token: this.refreshToken },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: this.timeout,
        }
      );
      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      if (this.accessToken && this.refreshToken) {
        await this.saveToken();
        console.log('Token refreshed successfully.');
      } else {
        throw new MabotError('Failed to refresh tokens: missing token in response');
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new MabotError(
          `Token refresh failed: ${err.response?.data?.detail || err.message}`,
          err.response?.status
        );
      }
      throw new MabotError(`Token refresh failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    if (!this.accessToken) {
      await this.loadToken();
      if (!this.accessToken) await this.login();
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
    filename?: string,
    mimetype?: string,
    caption?: string
  ): Promise<UpdateOut> {
    const url = `${this.config.baseUrl}/io/input`;
    const headers = await this.getAuthHeadersJson();
    let message;
    let payload;

    try {
      if (!mimetype) {
        if (caption) {
          throw new MabotError('A message cannot be of text type and have a caption');
        }
        message = textMsg('user', content.toString());
      } else {
        if (!filename) {
          throw new MabotError('Filename is required for file messages');
        }
        const base64Content = content instanceof ArrayBuffer
          ? btoa(String.fromCharCode(...new Uint8Array(content)))
          : btoa(content);
        message = fileMsg('user', filename, base64Content, mimetype, caption);
      }

      payload = UpdateInSchema.parse({ platform: 'web', chat_id: chatId, messages: [message] });
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