import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inventario Productos",
  description: "Listado Inventario de productos del restaurante",  // Descripción de la página
}

export default function InventarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}