// services/apiClient.ts
import { API_BASE_URL } from './api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;
  private onTokenExpired?: () => void;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Método para registrar callback cuando el token expire
  onTokenExpiredCallback(callback: () => void) {
    this.onTokenExpired = callback;
  }

  // Obtener token del localStorage
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  // Método para hacer requests con manejo automático de token expirado
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    console.log('🌐 ApiClient Request:', {
      url,
      method: options.method || 'GET',
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
    });

    // Configurar headers por defecto
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    // Merge headers
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    try {
      // Verificar conexión a internet
      if (typeof window !== 'undefined' && !window.navigator.onLine) {
        console.error('🔌 Sin conexión a internet');
        throw new ApiError('No hay conexión a internet. Por favor verifique su conectividad.', 0);
      }
      
      console.log('📤 Sending request:', {
        url,
        method: options.method || 'GET',
        headers,
        body: options.body
      });
      
      // Usar un timeout para la petición
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      console.log('📥 Response received:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });      // Verificar si el token ha expirado
      if (response.status === 401 || response.status === 403) {
        console.warn('🚨 Token expirado o acceso no autorizado - Iniciando logout...');
        
        // Limpiar token inmediatamente
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          
          // Disparar evento para componentes UI
          window.dispatchEvent(new CustomEvent('tokenExpired'));
        }
        
        // Ejecutar callback de token expirado con un pequeño delay para asegurar que se ejecute
        if (this.onTokenExpired) {
          console.log('🔄 Ejecutando callback de logout...');
          setTimeout(() => {
            try {
              this.onTokenExpired!();
            } catch (error) {
              console.error('❌ Error al ejecutar callback de logout:', error);
              // Fallback: redirigir directamente
              if (typeof window !== 'undefined') {
                console.log('🔄 Fallback: Redirigiendo directamente al login...');
                window.location.href = '/';
              }
            }
          }, 100);
        } else {
          // Si no hay callback, redirigir directamente
          console.log('⚠️ No hay callback configurado, redirigiendo directamente...');
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }
        
        throw new ApiError(
          'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
          response.status
        );
      }

      // Verificar otros errores HTTP
      if (!response.ok) {
        let errorData;
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        try {
          const responseText = await response.text();
          console.error('🚫 Error Response Body:', responseText);
          
          if (responseText) {
            try {
              errorData = JSON.parse(responseText);
              errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
              // Si no es JSON, usar el texto tal como está
              errorMessage = responseText || errorMessage;
            }
          }
        } catch (readError) {
          console.error('Error reading response body:', readError);
        }

        console.error('🚫 Request failed:', {
          url,
          status: response.status,
          statusText: response.statusText,
          errorMessage,
          errorData
        });

        throw new ApiError(errorMessage, response.status);
      }

      // Parsear respuesta JSON
      const responseText = await response.text();
      return responseText ? JSON.parse(responseText) : ({} as T);

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Error de red u otro tipo de error
      console.error('Error en request API:', error);
      
      // Detectar tipos específicos de errores para mensajes más descriptivos
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(
          'La solicitud tomó demasiado tiempo. Verifique su conexión o inténtelo más tarde.',
          0
        );
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        // Problema común cuando no se puede contactar al servidor
        throw new ApiError(
          'No se pudo contactar al servidor. Verifique la URL y su conexión a internet.',
          0
        );
      } else {
        throw new ApiError(
          'Error de conexión. Verifique su conexión a internet.',
          0
        );
      }
    }
  }

  // Métodos de conveniencia para diferentes tipos de requests
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Crear instancia singleton
export const apiClient = new ApiClient();