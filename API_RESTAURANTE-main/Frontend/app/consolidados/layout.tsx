import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Consolidados",
}

export default function ConsolidadosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}