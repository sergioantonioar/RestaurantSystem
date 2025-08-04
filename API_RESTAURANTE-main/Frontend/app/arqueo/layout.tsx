import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Arqueo",
}

export default function ArqueoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}