import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Apertura y Cierre atm",
}

export default function AperturaCierreAtmLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}