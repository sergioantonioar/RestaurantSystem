"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login, saveAuthToken, removeAuthToken, isAuthenticated } from "../services/auth-service"

interface User {
  id: number
  username: string
  role: string
}

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false)
  const router = useRouter()

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsUserAuthenticated(authenticated)

      // Aquí podrías también cargar los datos del usuario desde el token
      // o hacer una petición al backend para obtener el perfil del usuario
    }

    checkAuth()
  }, [])
  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await login({ username, password })

      // Guardar el token
      saveAuthToken(response.token)

      // Crear objeto de usuario basado en la respuesta
      const userData: User = {
        id: parseInt(response.data.id_admin),
        username: response.data.name_admin,
        role: response.role,
      }

      // Actualizar el estado
      setUser(userData)
      setIsUserAuthenticated(true)

      // Redireccionar según el rol
      if (response.role === "cocina") {
        router.push("/cocina")
      } else {
        router.push("/apertura-cierre")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    setUser(null)
    setIsUserAuthenticated(false)
    router.push("/")
  }

  return {
    user,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: isUserAuthenticated,
  }
}
