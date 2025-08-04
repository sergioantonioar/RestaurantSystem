"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  login as loginService,
  saveAuthToken,
  saveUserRole,
  saveUserId,
  clearAllAuthData,
} from "@/services/auth-service";
import { apiClient } from "@/services/apiClient";

interface User {
  id: string;
  name: string;
  email: string;
  dni: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const logout = () => {
    console.log("🚪 Iniciando logout...");
    try {
      Cookies.remove("user", { path: "/" });
      clearAllAuthData();
      setUser(null);
      setToken(null);
      setError(null);
      router.push("/");
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }, 500);
    } catch (error) {
      console.error("❌ Error durante logout:", error);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

useEffect(() => {
  const storedUser = Cookies.get("user");
  const storedToken = localStorage.getItem("authToken");

  console.log("🔍 useEffect - storedUser:", storedUser);
  console.log("🔍 useEffect - storedToken:", storedToken ? "presente" : "ausente");

  if (storedToken) {
    setToken(storedToken);
  }

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      const validRoles = ["ADMIN", "ATM", "COCINA"];
      if (!validRoles.includes(parsedUser.role)) {
        console.warn("❌ Rol no válido:", parsedUser.role);
        logout();
      } else {
        console.log("✅ Usuario restaurado desde cookie:", parsedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("❌ Error al parsear usuario desde cookies:", error);
      logout(); // prevenir estado inconsistente
    }
  }

  apiClient.onTokenExpiredCallback(() => {
    console.warn("🚨 Token expirado detectado por callback");
    logout();
  });

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === "authToken" && !e.newValue && user) {
      console.warn("🔁 authToken eliminado, cerrando sesión");
      logout();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageChange);
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorageChange);
    }
  };
}, []);


  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginService({ username, password });
      console.log("🔐 Respuesta de login:", response);

      const role = response.role?.toUpperCase();
      const data = response.data;

      let userData: User;

      if (role === "ADMIN") {
        userData = {
          id: data.id_admin,
          name: data.name_admin,
          email: data.email_admin,
          dni: data.dni_admin,
          role,
        };
      } else if (role === "ATM") {
        userData = {
          id: data.id_atm,
          name: data.name_atm,
          email: data.email,
          dni: data.dni,
          role,
        };
      } else if (role === "COCINA") {
        userData = {
          id: data.id_cocina,
          name: data.name_cocina,
          email: data.email,
          dni: data.dni,
          role,
        };
      } else {
        throw new Error(`Rol no soportado: ${role}`);
      }

      // 🛡️ Guardar token y datos antes de actualizar estado
      saveAuthToken(response.token);
      saveUserRole(role);
      saveUserId(userData.id);

      Cookies.set("user", JSON.stringify(userData), {
        expires: 7,
        path: "/",
        sameSite: "Lax",
        // secure: true, // descomentar si estás en HTTPS
      });

      console.log("✅ userData y token guardados correctamente");

      setToken(response.token);
      setUser(userData);

      if (role === "COCINA") {
        router.push("/cocina");
      } else {
        router.push("/apertura-cierre");
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
