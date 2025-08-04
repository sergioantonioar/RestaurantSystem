import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pedido",
}

export default function PedidoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}