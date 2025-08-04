// Importación de componentes necesarios para la página de empleados
import MainLayout from "@/components/layout/MainLayout"  // Componente de diseño principal que proporciona la estructura común
import EmpleadosTable from "./components/EmpleadosTable"  // Tabla que muestra la lista de empleados
import { ProtectedRoute } from "@/components/common/ProtectedRoute"  // Componente de protección de rutas
import { AppModule } from "@/utils/permissions"

/**
 * Componente principal para la página de administración de empleados
 * Muestra un listado de empleados del restaurante con opciones para gestionar registros
 * SOLO ACCESIBLE PARA ADMIN
 */
export default function EmpleadosPage() {
  return (
    <ProtectedRoute requiredModule={AppModule.EMPLEADOS}>
      <MainLayout>
        {/* Componente de tabla que muestra los empleados registrados */}
        <EmpleadosTable />      {/* Sección de paginación y estadísticas */}
      </MainLayout>
    </ProtectedRoute>
  )
}
