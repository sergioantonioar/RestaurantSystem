import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Empleados",
}

export default function EmpleadosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}