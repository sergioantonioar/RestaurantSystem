"use client";

import { useState, type FormEvent, type ChangeEvent, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
// Asegurarnos de importar los estilos correctos
import "@/styles/login.css";

interface FormData {
  username: string;
  password: string;
}

export default function LoginForm() {
  const { login, isLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Actualizar el error local cuando cambia el error de autenticación
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  useEffect(() => {
    // Log para depuración
    console.log("Estado de isLoading:", isLoading);
  }, [isLoading]);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error cuando el usuario comienza a escribir nuevamente
    if (error) setError(null);
  };  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validación básica del lado del cliente
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Por favor, complete todos los campos");
      return;
    }
    
    // Limpiar errores previos
    setError(null);
    
    console.log("Intentando iniciar sesión con:", formData);
    try {
      await login(formData.username, formData.password);
      // Si llegamos aquí y no hay error, es un inicio de sesión exitoso
    } catch (err) {
      // No mostrar el error en la consola para evitar errores en la interfaz
      // El error ya se maneja en el AuthContext y se muestra en la UI
      // Opcionalmente podemos agregar mensajes de error personalizados aquí si es necesario
      
      // Si por alguna razón no se estableció el error desde AuthContext, establecerlo aquí
      if (!error && err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    // Asegurarnos de que el contenedor ocupe toda la pantalla y tenga el centrado correcto
    <div className="login-container" style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="background-pattern"></div>
      <div className="login-form-container">
        <div className="login-card">
          <div className="login-header">
            <h1>FOODLY</h1>
          </div>          <div className="login-body">
            {error && (
              <div
                style={{
                  padding: "12px",
                  marginBottom: "20px",
                  backgroundColor: "#FFEBEE",
                  color: "#D32F2F",
                  borderRadius: "8px",
                  fontSize: "14px",
                  textAlign: "center",
                  border: "1px solid #FFCDD2",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "500"
                }}
              >
                <i className="fas fa-exclamation-circle" style={{ marginRight: "8px", fontSize: "16px" }}></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Usuario
                </label>
                <div className="form-input-container">
                  <input
                    type="text"
                    className="form-input"
                    id="username"
                    name="username"
                    placeholder="Ingrese su usuario"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <i className="fas fa-user icon"></i>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <div className="form-input-container">
                  <input
                    type="password"
                    className="form-input"
                    id="password"
                    name="password"
                    placeholder="Ingrese su contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <i className="fas fa-lock icon"></i>
                </div>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Iniciando sesión...</span>
                ) : (
                  <span>Iniciar sesión</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
