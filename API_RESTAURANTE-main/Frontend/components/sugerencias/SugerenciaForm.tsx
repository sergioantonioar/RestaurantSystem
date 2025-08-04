"use client"

import { useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { API_BASE_URL } from "@/services/api"
export default function SugerenciaForm() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [sugerencia, setSugerencia] = useState("")
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem("authToken") || Cookies.get("token") || ""

    try {
      await axios.post(
        `${API_BASE_URL}api/sugerencias`,
        { nombre, email, sugerencia },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      )
      setEnviado(true)
      setNombre("")
      setEmail("")
      setSugerencia("")
    } catch (error) {
      console.error("Error al enviar sugerencia", error)
      alert("Ocurrió un error al enviar la sugerencia.")
    }
  }

  return (
    <div style={{ display: "flex", maxWidth: "1200px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <form
        onSubmit={handleSubmit}
        style={{ flex: 1, padding: "20px", borderRight: "1px solid #ff7c1f" }}
      >
        <h2 style={{ color: "#ff6600", display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="fas fa-user-circle"></i> Formulario de Sugerencias
        </h2>
        <p style={{ marginBottom: "10px", marginTop: "10px", fontSize: "14px", color: "#888" }}>
          Coloque sus sugerencias
        </p>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Escriba su sugerencia aquí..."
          value={sugerencia}
          onChange={(e) => setSugerencia(e.target.value)}
          required
          style={{ ...inputStyle, height: "150px", resize: "none" }}
        />
        <button type="submit" style={buttonStyle}>
          <i className="fas fa-paper-plane me-1"></i> Enviar
        </button>
        {enviado && (
          <div style={{ marginTop: "10px", color: "green" }}>
            ¡Gracias por tu sugerencia!
          </div>
        )}
      </form>

      <div style={{ width: "300px", padding: "40px", fontSize: "14px" }}>
        <div style={infoItem}>
          <i className="fas fa-map-marker-alt me-2" style={iconStyle} />
          <div>
            <strong>Dirección</strong><br />
            Av. Perú N°2456
          </div>
        </div>
        <div style={infoItem}>
          <i className="fas fa-phone-alt me-2" style={iconStyle} />
          <div>
            <strong>Teléfono</strong><br />
            01 2554478<br />+51 955236587
          </div>
        </div>
        <div style={infoItem}>
          <i className="fas fa-envelope me-2" style={iconStyle} />
          <div>
            <strong>Correo</strong><br />
            contactos@foodly.com
          </div>
        </div>
      </div>
    </div>
  )
}

// --- estilos básicos
const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#ff6600",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px"
}

const infoItem: React.CSSProperties = {
  marginBottom: "20px",
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
}

const iconStyle: React.CSSProperties = {
  color: "#ff6600",
  fontSize: "18px",
  marginTop: "2px"
}
