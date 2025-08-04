import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Apertura y Cierre",
}

export default function AperturaCierreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}