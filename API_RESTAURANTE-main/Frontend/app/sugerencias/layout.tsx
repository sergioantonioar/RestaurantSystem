import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cocina",
}

export default function SugerenciasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}