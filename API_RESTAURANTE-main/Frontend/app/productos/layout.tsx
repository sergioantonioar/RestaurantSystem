import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Productos",
  description: "Listado de productos del restaurante",  // Descripción de la página
}

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}