// Importación de componentes necesarios para la página de empleados
import MainLayout from "@/components/layout/MainLayout"  // Componente de diseño principal que proporciona la estructura común
import ActionButton from "@/components/common/ActionButton"  // Botón reutilizable con iconos
import ProductosTable from "./components/ProductosTable"// Tabla que muestra la lista de productos
/**
 * Componente principal para la página de administración de productos
 * Muestra un listado de productos del restaurante con opciones para gestionar registros
 */
export default function ProductosPage() {
  return (
    <MainLayout>


      {/* Componente de tabla que muestra los productos registrados */}
      <ProductosTable />


    </MainLayout>
  )
}
