"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthData } from "@/hooks/useAuthData";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: string;
  fallbackRoute?: string;
}

/**
 * Componente para proteger rutas basado en roles y permisos
 * Verifica si el usuario tiene acceso al módulo actual
 */
export const ProtectedRoute = ({ 
  children, 
  requiredModule,
  fallbackRoute = "/" 
}: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, canAccess, getUserDefaultRoute, user } = useAuthData();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      console.log("🔐 Verificando acceso a la ruta:", pathname);
      
      // Si no está autenticado, redirigir al login
      if (!isAuthenticated()) {
        console.log("❌ Usuario no autenticado, redirigiendo al login");
        router.push("/");
        return;
      }      // Determinar el módulo a verificar
      const moduleToCheck = requiredModule || pathname;
      
      // Verificar si tiene acceso al módulo
      if (moduleToCheck && !canAccess(moduleToCheck)) {
        console.log(`❌ Usuario sin acceso al módulo: ${moduleToCheck}`);
        console.log(`👤 Rol del usuario: ${user?.role}`);
        
        // Redirigir a la ruta por defecto del usuario o fallback
        const defaultRoute = getUserDefaultRoute();
        const redirectTo = defaultRoute !== "/" ? defaultRoute : fallbackRoute;
        
        console.log(`🔄 Redirigiendo a: ${redirectTo}`);
        router.push(redirectTo);
        return;
      }

      console.log(`✅ Acceso autorizado al módulo: ${moduleToCheck}`);
      setIsChecking(false);
    };

    // Pequeño delay para asegurar que el contexto esté completamente cargado
    const timeoutId = setTimeout(checkAccess, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname, isAuthenticated, canAccess, router, requiredModule, fallbackRoute, getUserDefaultRoute, user]);

  // Mostrar loading mientras se verifica el acceso
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * HOC para proteger componentes
 */
export function withRoleProtection<T extends object>(
  Component: React.ComponentType<T>,
  requiredModule?: string
) {
  return function ProtectedComponent(props: T) {
    return (
      <ProtectedRoute requiredModule={requiredModule}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
