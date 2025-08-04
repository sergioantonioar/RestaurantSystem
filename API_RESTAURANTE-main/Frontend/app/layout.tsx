// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/context/AuthContext"
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import "./globals.css"
import "../styles/sidebar-responsive.css"

import Script from "next/script"

export const metadata: Metadata = {
  title: {
    template: 'FoodLy - %s',
    default: 'FoodLy',
  },
  description: "Sistema de gestión para el restaurante FoodLy",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head />
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>

        {/* ✅ Bootstrap JS dinámico en cliente */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
