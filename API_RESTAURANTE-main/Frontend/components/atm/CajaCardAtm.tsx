"use client"; // 🔧 Permite usar hooks y lógica cliente en este componente

import React from "react";

// 🔹 Tipado de las propiedades esperadas para el componente
interface CajaCardAtmProps {
  nombre: string;                     // Nombre de la caja
  fecha: string;                      // Fecha de creación o asignación
  estado: "abierta" | "cerrada" | "pausada";  // Estado actual de la caja
  asignada: boolean;                 // Si tiene o no un ATM asignado
  asignadaAlUsuario?: boolean;       // ✅ Indica si esta caja está asignada al ATM actual (usuario logueado)
  atmId?: string;                    // ID del ATM asignado
  onAccion: () => void;              // Función que se ejecuta al hacer clic en el botón de acción
  loading?: boolean;                 // Indica si está en proceso (ej. abriendo o cerrando caja)
}

// 🧩 Componente que muestra una tarjeta visual para una caja asignada
export default function CajaCardAtm({
  nombre,
  fecha,
  estado,
  asignada,
  asignadaAlUsuario = false,
  atmId,
  onAccion,
  loading = false,
}: CajaCardAtmProps) {
  const esSinATM = !asignada; // 🧠 Si la caja no tiene ningún ATM asignado

  // 🎨 Diccionario de estilos y textos por estado
  const colores = {
    abierta: {
      bg: "bg-success-subtle",
      icon: "fas fa-play text-success",
      badge: "bg-success",
      estado: "Abierta",
      btn: "btn-danger",
      btnText: "Cerrar Caja",
      iconoBoton: "fa-stop-circle",
    },
    cerrada: {
      bg: "bg-warning-subtle",
      icon: "fas fa-lock text-warning",
      badge: "bg-warning text-dark",
      estado: "Cerrada",
      btn: "btn-success",
      btnText: "Activar Caja",
      iconoBoton: "fa-play",
    },
    pausada: {
      bg: "bg-light",
      icon: "fas fa-pause-circle text-muted",
      badge: "bg-secondary",
      estado: "Pausada",
      btn: "btn-success",
      btnText: "Reanudar Caja",
      iconoBoton: "fa-play",
    },
  };

  const estilo = colores[estado]; // 🎯 Se selecciona el estilo según el estado de la caja

  return (
    <div
      className={`card ${estilo.bg} shadow-sm p-3 mb-4`}
      style={{ borderRadius: "16px", minWidth: "300px", maxWidth: "360px" }}
    >
      {/* 🔹 Encabezado con icono, nombre y fecha */}
      <div className="d-flex justify-content-between align-items-start">
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle bg-white d-flex justify-content-center align-items-center me-2"
            style={{ width: 32, height: 32 }}
          >
            <i className={`${estilo.icon}`}></i>
          </div>
          <div>
            <h5 className="mb-0 text-capitalize">{nombre}</h5>
            <small>{fecha}</small>
          </div>
        </div>
        <span className={`badge ${estilo.badge}`}>{estilo.estado}</span>
      </div>

      <hr />

      {/* 🧾 Muestra si no hay ATM asignado */}
      {esSinATM ? (
        <div className="text-center my-3">
          <i className="fas fa-user-slash fa-2x text-muted mb-2"></i>
          <p className="mb-0">Requiere empleado para funcionar</p>
        </div>
      ) : (
        // 🧍 Muestra datos del ATM asignado
        <div className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <i className="fas fa-user me-2 text-primary"></i>
            <strong>ATM {atmId?.slice(0, 10)}...</strong>
          </div>
          <small className="text-muted">
            {asignadaAlUsuario ? "Caja asignada a ti" : "Empleado asignado"}
          </small>
        </div>
      )}

      {/* 🔘 Botón de acción (abrir/cerrar caja) */}
      <div className="d-flex justify-content-end mt-3">
        <button
          onClick={onAccion}
          className={`btn ${estilo.btn} btn-sm px-4`}
          disabled={!asignadaAlUsuario || loading} // ✅ Solo se permite si está asignada al usuario
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Procesando...
            </>
          ) : (
            <>
              <i className={`fas ${estilo.iconoBoton} me-1`}></i>
              {estilo.btnText}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
