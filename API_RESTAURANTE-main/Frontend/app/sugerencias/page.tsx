// Directiva para marcar este componente como Cliente, necesario para manipular el DOM
"use client"

// Importaciones necesarias
import { useEffect } from "react"                    // Hook para efectos secundarios
import MainLayout from "@/components/layout/MainLayout" // Layout principal
import SugerenciaForm from "@/components/sugerencias/SugerenciaForm"                      // Estilos específicos para esta página

/**
 * Componente para la página de logros/dashboard
 * Muestra métricas de rendimiento, gráficos y estadísticas del restaurante
 */
export default function SugerenciasPage() {
  return (
    <MainLayout>
      {/* Sección de bienvenida con título y mensaje personalizado */}
      {/* 🧭 Encabezado de la página */}
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <h3>
            <i className="fa-solid fa-lightbulb"></i> Formulario de Sugerencias
          </h3>
        </div>
      </nav>
        {/* Formulario de sugerencias */}
        <SugerenciaForm />
    </MainLayout>
  )
}
