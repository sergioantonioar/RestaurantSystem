import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gráficos",
}

export default function GraficosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}