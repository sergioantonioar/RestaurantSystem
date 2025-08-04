// Importación de componentes necesarios para la página de cocina
import MainLayout from "@/components/layout/MainLayout"  // Layout principal que proporciona la estructura común
import OrdenCard from "@/components/cocina/OrdenCard"    // Tarjeta para mostrar información de cada orden
import PageHeader from "@/components/common/PageHeader"  // Encabezado estándar para todas las páginas
import "@/styles/common.css"                            // Estilos comunes para mantener la consistencia visual

/**
 * Componente principal para la pantalla de cocina
 * Muestra órdenes activas para que el personal de cocina pueda gestionarlas
 */
export default function CocinaPage() {
  // Datos de ejemplo para las órdenes (en producción vendrían de una API/base de datos)
  const ordenes = [
    {
      id: 1,
      cliente: "Juan Pérez",
      mesa: "Mesa 3",
      estado: "pendiente" as const,  // 'as const' garantiza que TypeScript reconozca el valor literal
      tiempo: "5 min",
      items: [
        { nombre: "Ceviche mixto", cantidad: 2 },
        { nombre: "Arroz con mariscos", cantidad: 1, observacion: "Sin ají" },
      ],
    },
    {
      id: 2,
      cliente: "María López",
      mesa: "Mesa 5",
      estado: "preparando" as const,
      tiempo: "10 min",
      items: [
        { nombre: "Lomo saltado", cantidad: 1 },
        { nombre: "Chicharrón de pescado", cantidad: 1 },
      ],
    },
    {
      id: 3,
      cliente: "Carlos Ruiz",
      mesa: "Mesa 2",
      estado: "listo" as const,
      tiempo: "15 min",
      items: [
        { nombre: "Ají de gallina", cantidad: 2 },
        { nombre: "Causa rellena", cantidad: 1 },
      ],
    },
  ]

  return (
    <MainLayout>
      {/* Encabezado de la página con título e icono */}
      <PageHeader title="Cocina" icon="fas fa-solid fa-utensils" />

      {/* Sección principal con animación de entrada */}
      <div className="foodly-section fade-in-up">
        {/* Barra superior con título y reloj */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0" style={{ color: 'var(--primary)' }}>Gestión de Órdenes</h2>
          <div id="reloj" className="fs-4" style={{ color: 'var(--primary)', fontWeight: 500 }}>
            <i className="fas fa-clock me-2"></i>
            12:30:45
          </div>
        </div>

        {/* Cuadrícula de tarjetas de órdenes */}
        <div className="row">
          {/* Mapeo de cada orden para generar una tarjeta */}
          {ordenes.map((orden) => (
            <div className="col-md-4 mb-4" key={orden.id}>
              {/* Componente OrdenCard que recibe todas las propiedades de la orden */}
              <OrdenCard {...orden} />
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
