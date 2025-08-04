"use client"
// Importación de componentes necesarios para la página de arqueo de caja
import MainLayout from "@/components/layout/MainLayout"        // Layout principal con estructura común
import PageHeader from "@/components/common/PageHeader"        // Encabezado estándar para páginas
import ArqueoFilters from "@/components/arqueo/ArqueoFilters"
import Card from "@/components/common/Card"                    // Componente de tarjeta para secciones
import ArqueoTable, { Arqueo } from "@/components/arqueo/ArqueoTable"
import ArqueoDetailModal from "@/components/arqueo/ArqueoDetailModal"
import { useState, useEffect } from "react"
import { apiClient } from "@/services/apiClient"

/**
 * Componente principal para la página de Arqueo de Caja
 * Permite al usuario visualizar balances, realizar cierres de caja y exportar informes
 */
export default function ArqueoPage() {
  const [selectedAtm, setSelectedAtm] = useState<string | null>(null)
  const [selectedBoxName, setSelectedBoxName] = useState<string | null>(null)
  const [arqueos, setArqueos] = useState<Arqueo[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [modalArqueo, setModalArqueo] = useState<Arqueo | null>(null)

  // Manejar cambios de filtro (ATM y caja)
  // Cuando el usuario selecciona un ATM o caja, actualiza el estado y reinicia la paginación
  const handleFilterChange = (atmId: string | null, boxName: string | null) => {
    setSelectedAtm(atmId)
    setSelectedBoxName(boxName)
    setPage(0)
  }

  // Efecto para obtener los arqueos de la caja seleccionada
  // Si no hay caja seleccionada, limpia la tabla
  // Si hay caja, consulta el backend y actualiza la lista
  useEffect(() => {
    if (!selectedBoxName) {
      setArqueos([])
      return
    }
    setLoading(true)
    apiClient.get<{ status: number; message: string; data: Arqueo[] }>(`arching/Box/name/${encodeURIComponent(selectedBoxName)}?page=${page}`)
      .then(res => {
        setArqueos(res.data)
      })
      .finally(() => setLoading(false))
  }, [selectedBoxName, page])

  // Render principal de la página de arqueo
  return (
    <MainLayout>
      {/* Encabezado de la página */}
      <PageHeader title="Arqueo de Caja" icon="fas fa-clipboard-check" />
      {/* Filtros de ATM y caja */}
      <ArqueoFilters
        onFilterChange={handleFilterChange}
      />
      {/* Tabla de arqueos y modal de detalles */}
      <Card title="Listado de Arqueos" icon="fas fa-list" headerClass="bg-success">
        {loading ? (
          <div className="text-center my-4 text-secondary">Cargando arqueos...</div>
        ) : !selectedBoxName ? (
          <div className="text-center my-4 text-muted">Por favor, seleccione una caja para visualizar los datos correspondientes.</div>
        ) : arqueos.length === 0 ? (
          <div className="text-center my-4 text-muted">No hay arqueos para mostrar. Selecciona una caja y aplica filtros.</div>
        ) : (
          <>
            <ArqueoTable arqueos={arqueos} onView={setModalArqueo} />
            {/* Modal de detalles de arqueo */}
            <ArqueoDetailModal arqueo={modalArqueo} open={!!modalArqueo} onClose={() => setModalArqueo(null)} />
          </>
        )}
      </Card>

      {/* Consolidado de datos del arqueo actual */}
      <Card title="Consolidado de Datos" icon="fas fa-chart-bar" headerClass="bg-info mt-4">
        <div style={{padding: 0, marginTop: 0}}>
          {!selectedBoxName ? (
            <div className="text-center my-4 text-muted">Por favor, seleccione una caja para visualizar los datos correspondientes.</div>
          ) : (() => {
            const arqueoActual = arqueos.find(a => a.end_time === null);
            return arqueoActual ? (
              <div style={{marginTop: 0}}>
                <div style={{marginTop: 0, marginBottom: 0}}><b>Arqueo Actual</b></div>
                <div style={{marginTop: 0, marginBottom: 0}}><b>Fecha:</b> {arqueoActual.date}</div>
                <div style={{marginTop: 0, marginBottom: 0}}><b>Hora Inicio:</b> {arqueoActual.star_time}</div>
                <div style={{marginTop: 0, marginBottom: 0}}><b>Monto Inicial:</b> {arqueoActual.init_amount?.toFixed(2)}</div>
                <div style={{marginTop: 0, marginBottom: 0}}><b>Monto Final:</b> Aún sin cierre</div>
                <div style={{marginTop: 0, marginBottom: 0}}><b>Total:</b> Aún sin cierre</div>
              </div>
            ) : null;
          })()}
        </div>
      </Card>
    </MainLayout>
  )
}
