"use client"; // 🔧 Habilita que el componente funcione en el lado del cliente (uso de hooks, interactividad, etc.)

// 📦 Importación de hooks y componentes necesarios
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { useAuthData } from "@/hooks/useAuthData";
import { boxService, BoxDTO, ArqueoInitDTO } from "@/services/box-service";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import CajaCardAtm from "@/components/atm/CajaCardAtm";
import ArqueoModal from "@/components/apertura-cierre/ArqueoModal";

// 🧩 Componente principal protegido por permisos
export default function AperturaCierreAtmPage() {
  return (
    <ProtectedRoute requiredModule="/apertura-cierre-atm">
      <AperturaCierreAtmContent />
    </ProtectedRoute>
  );
}

// 🔍 Contenido de la página principal: gestiona lógica de apertura/cierre de caja
function AperturaCierreAtmContent() {
  const { user } = useAuthData(); // 🔐 Obtiene datos del usuario autenticado

  // 📦 Estado para almacenar la caja asignada al ATM logueado
  const [cajaAsignada, setCajaAsignada] = useState<BoxDTO | null>(null);

  // 🔄 Estados para control de carga y procesos
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🧾 Modal de confirmación previo a acciones
  const [modalData, setModalData] = useState<{
    box: BoxDTO;
    accion: "abrir" | "cerrar";
  } | null>(null);

  // 💰 Estados para el modal de arqueo (registro de monto inicial)
  const [showArqueoModal, setShowArqueoModal] = useState(false);
  const [selectedCajaForArqueo, setSelectedCajaForArqueo] = useState<string | null>(null);

  // 📡 Carga la caja asignada al ATM actual
  const loadCajas = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await boxService.getBoxesByAtm(user.id); // 🔁 Llama a la API
      const cajaDelUsuario = response.data[0] ?? null; // 🧠 Solo se toma la primera
      setCajaAsignada(cajaDelUsuario); // ✅ Se guarda en el estado
    } catch (error) {
      console.error("❌ Error al cargar cajas:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Ejecuta carga inicial cuando el componente se monta
  useEffect(() => {
    if (user?.id) loadCajas();
  }, [user]);

  // ⚙️ Acción principal cuando se confirma cerrar o abrir
  const handleConfirmAccion = async () => {
    if (!modalData || !user?.id) return;
    const { box, accion } = modalData;

    try {
      setIsProcessing(true);

      if (accion === "cerrar") {
        // 🔒 Si la acción es cerrar, se llama directamente al servicio
        await boxService.closeBox(box.id_box);
        console.log("✅ Caja cerrada");
        await loadCajas();
      } else {
        // 🔓 Si la acción es abrir, se abre el modal de arqueo
        setShowArqueoModal(true);
        setSelectedCajaForArqueo(box.id_box);
      }
    } catch (error) {
      console.error("❌ Error en acción:", error);
    } finally {
      setIsProcessing(false);
      setModalData(null); // 🧼 Limpia estado del modal
    }
  };

  // ✅ Lógica que ejecuta la apertura de caja con el monto inicial
  const abrirCajaConArqueo = async (boxId: string, arqueoData: ArqueoInitDTO) => {
    if (!user?.id) return;
    try {
      setIsProcessing(true);
      await boxService.openBox(boxId, {
        init_amount: arqueoData.init_amount,
        responsible_user: user.id,
        notes: "Apertura manual con arqueo",
      });
      console.log("✅ Caja abierta con arqueo");
      await loadCajas();
    } catch (error) {
      console.error("❌ Error al abrir caja:", error);
    } finally {
      setShowArqueoModal(false); // 🔐 Cierra modal
      setSelectedCajaForArqueo(null); // 🔃 Limpia caja seleccionada
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      {/* 🧭 Encabezado de la página */}
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <h3>
            <i className="fas fa-box-open"></i> Apertura y Cierre Caja
          </h3>
        </div>
      </nav>

      <div className="container-fluid">
        {/* 🎨 Título + botón de actualización */}
        <div
          className="d-flex justify-content-between align-items-center mb-4 p-3 text-white"
          style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
          }}
        >
          <div className="d-flex align-items-center">
            <i className="fas fa-cash-register me-2" style={{ fontSize: '24px' }}></i>
            <h3 className="mb-0">Tu Caja Asignada</h3>
          </div>
          <button className="btn btn-light btn-sm" onClick={loadCajas} disabled={loading}>
            <i className="fas fa-sync-alt me-1"></i>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>

        {/* 📦 Muestra la tarjeta de caja asignada */}
        {cajaAsignada ? (
          <div className="d-flex flex-wrap gap-3">
            <CajaCardAtm
              key={cajaAsignada.id_box}
              nombre={cajaAsignada.name_box}
              fecha={cajaAsignada.date}
              estado={cajaAsignada.is_open ? "abierta" : "cerrada"}
              asignada={true}
              asignadaAlUsuario={true}
              atmId={user?.id}
              onAccion={() =>
                setModalData({
                  box: cajaAsignada,
                  accion: cajaAsignada.is_open ? "cerrar" : "abrir",
                })
              }
              loading={cajaAsignada.isLoading}
            />
          </div>
        ) : (
          // 🟨 Muestra advertencia si no hay caja
          <div className="alert alert-warning">
            <i className="fas fa-exclamation-circle me-2"></i>
            No tienes ninguna caja asignada actualmente.
          </div>
        )}

        {/* 🧾 Modal de confirmación para abrir/cerrar */}
        <ConfirmationModal
          isOpen={!!modalData}
          onClose={() => setModalData(null)}
          onConfirm={handleConfirmAccion}
          title={`¿Estás seguro de ${modalData?.accion === "abrir" ? "abrir" : "cerrar"} esta caja?`}
          message={
            modalData?.accion === "abrir"
              ? "Se requiere arqueo inicial antes de abrir la caja."
              : "La caja será cerrada y no podrá recibir más movimientos."
          }
          type={modalData?.accion === "abrir" ? "success" : "danger"}
          isLoading={isProcessing}
        />

        {/* 💵 Modal para registrar el monto inicial */}
        {showArqueoModal && selectedCajaForArqueo && (
          <ArqueoModal
            isOpen={showArqueoModal}
            onClose={() => {
              setShowArqueoModal(false);
              setSelectedCajaForArqueo(null);
            }}
            onSubmit={(data) => abrirCajaConArqueo(selectedCajaForArqueo, data)}
            isLoading={isProcessing}
            cajaNombre={cajaAsignada?.name_box || "Caja"}
          />
        )}
      </div>
    </MainLayout>
  );
}
