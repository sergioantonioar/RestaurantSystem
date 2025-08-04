// Este archivo servirá como interfaz entre tu frontend y el backend de Spring Boot

interface LoginResponse {
  token: string;
  role: string;
  data: Record<string, any>; // para admitir múltiples estructuras
}


interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {  try {
    // Reemplaza esta URL con la URL real de tu API de Spring Boot
    const response = await fetch("http://localhost:8080/api/v1.5/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    // Obtener el texto de la respuesta primero
    const responseText = await response.text();
    
    // Intentar parsear como JSON si hay contenido
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      console.error("Error al parsear respuesta JSON:", e);
      throw new Error("Formato de respuesta inválido del servidor");
    }    if (!response.ok) {
      // Manejar diferentes tipos de errores según el status
      if (response.status === 401 || response.status === 403) {
        throw new Error("Usuario o contraseña incorrectos. Por favor, verifica tus credenciales.");
      }  else if (response.status === 404) {
        throw new Error("Usuario no encontrado. Por favor, verifica que el usuario exista.");
      } else {
        // Usar el mensaje del servidor si está disponible, o proporcionar un mensaje genérico con información útil
        const errorMessage = data?.message || `Error de conexión: No se pudo completar la autenticación.`;
        throw new Error(errorMessage);
      }
    }

    // Si la respuesta es exitosa pero no hay datos
    if (!data) {
      throw new Error("Respuesta vacía del servidor");
    }

    console.log("Respuesta del servidor:", data);
    return data as LoginResponse;
  } catch (error) {
    console.error("Error en el servicio de autenticación:", error);
    throw error;
  }
}

export function saveAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem("authToken", token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("authToken");
  }
  return null;
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("authToken");
  }
}

export function saveUserRole(role: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem("userRole", role);
  }
}

export function getUserRole(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("userRole");
  }
  return null;
}

export function removeUserRole(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("userRole");
  }
}

export function saveUserId(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem("userId", id);
  }
}

export function getUserId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("userId");
  }
  return null;
}

export function removeUserId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("userId");
  }
}

export function clearAllAuthData(): void {
  removeAuthToken();
  removeUserRole();
  removeUserId();
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
