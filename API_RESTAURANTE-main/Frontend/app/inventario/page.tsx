// Importación de componentes necesarios para la página de empleados
import MainLayout from "@/components/layout/MainLayout"  // Componente de diseño principal que proporciona la estructura común
import ActionButton from "@/components/common/ActionButton"  // Botón reutilizable con iconos
import InventarioTable from "./components/InventarioTable"// Tabla que muestra la lista de Inventario
/**
 * Componente principal para la página de administración de productos
 * Muestra un listado de productos del restaurante con opciones para gestionar registros
 */
export default function InventarioPage() {
  return (
    <MainLayout>


      {/* Componente de tabla que muestra los productos registrados */}
      <InventarioTable />


    </MainLayout>
  )
}
