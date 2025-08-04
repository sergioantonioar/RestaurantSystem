import { Metadata } from "next" // Importamos el tipo Metadata de Next.js para definir metadatos de la página
import { Suspense } from "react" // Importamos Suspense para manejar estados de carga
import LoginForm from "@/components/login-form" // Importamos el componente LoginForm desde components

/**
 * Metadata para la página de inicio de sesión
 * Define el título que se mostrará en la pestaña del navegador
 */
export const metadata: Metadata = {
  title: "FoodLy - Login",
}

/**
 * Componente principal de la página de login
 * Es un componente del lado del servidor que renderiza el formulario de inicio de sesión
 * @returns Página de login con el formulario envuelto en Suspense para manejar estados de carga
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      {/* 
        Utilizamos Suspense para mostrar un indicador de carga mientras
        se carga el componente LoginForm que maneja la autenticación
      */}
      <LoginForm />
    </Suspense>
  )
}
