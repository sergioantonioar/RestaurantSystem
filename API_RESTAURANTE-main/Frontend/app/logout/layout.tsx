import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cerrar sesión",
}

export default function LogoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}