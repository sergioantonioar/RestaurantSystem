"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function LogoutPage() {
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    logout()
    router.push("/")
  }, [logout, router])

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="text-center">
        <h2>Cerrando sesión...</h2>
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    </div>
  )
}
