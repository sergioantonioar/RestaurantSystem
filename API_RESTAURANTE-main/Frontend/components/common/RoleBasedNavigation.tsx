"use client";

import { useAuthData } from "@/hooks/useAuthData";
import { AppModule, getRoleName } from "@/utils/permissions";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  module: AppModule;
  label: string;
  icon?: string;
  description?: string;
}

// Configuración de los elementos de navegación
const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    module: AppModule.APERTURA_CIERRE,
    label: "Apertura/Cierre",
    icon: "🏪",
    description: "Gestión de apertura y cierre de caja"
  },
  {
    module: AppModule.ARQUEO,
    label: "Arqueo",
    icon: "💰",
    description: "Arqueo de caja"
  },
  {
    module: AppModule.CONSOLIDADOS,
    label: "Consolidados",
    icon: "📊",
    description: "Reportes consolidados"
  },
  {
    module: AppModule.GRAFICOS,
    label: "Gráficos",
    icon: "📈",
    description: "Análisis y gráficos"
  },
  {
    module: AppModule.LOGROS,
    label: "Logros",
    icon: "🏆",
    description: "Sistema de logros"
  },
  {
    module: AppModule.EMPLEADOS,
    label: "Empleados",
    icon: "👥",
    description: "Gestión de empleados"
  },
  {
    module: AppModule.PEDIDO,
    label: "Pedidos",
    icon: "📝",
    description: "Gestión de pedidos"
  },
  {
    module: AppModule.PRODUCTOS,
    label: "Productos",
    icon: "🍽️",
    description: "Gestión de productos"
  },
  {
    module: AppModule.INVENTARIO,
    label: "Inventario",
    icon: "📦",
    description: "Control de inventario"
  },
  {
    module: AppModule.COCINA,
    label: "Cocina",
    icon: "👨‍🍳",
    description: "Módulo de cocina"
  }
];

export const RoleBasedNavigation = () => {
  const { canAccess, user, getUserRoleName } = useAuthData();
  const pathname = usePathname();

  // Filtrar elementos de navegación basado en permisos
  const accessibleItems = NAVIGATION_ITEMS.filter(item => canAccess(item.module));

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm border-b">
      {/* Header con información del usuario */}
      <div className="px-6 py-3 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Panel de Control
            </h2>
            <p className="text-sm text-gray-600">
              Bienvenido, <span className="font-medium">{user.name}</span> ({getUserRoleName()})
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Rol: {user.role}</p>
            <p className="text-xs text-gray-500">ID: {user.id}</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {accessibleItems.map((item) => {
            const isActive = pathname === item.module;
            
            return (
              <Link
                key={item.module}
                href={item.module}
                className={`
                  group relative flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200
                  ${isActive 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className={`
                  text-2xl mb-2 transition-transform duration-200 group-hover:scale-110
                  ${isActive ? 'transform scale-110' : ''}
                `}>
                  {item.icon}
                </div>
                
                <h3 className={`
                  font-medium text-sm text-center
                  ${isActive ? 'text-blue-700' : 'text-gray-700'}
                `}>
                  {item.label}
                </h3>
                
                {item.description && (
                  <p className={`
                    text-xs text-center mt-1 transition-opacity duration-200
                    ${isActive ? 'text-blue-600' : 'text-gray-500'}
                  `}>
                    {item.description}
                  </p>
                )}

                {/* Indicador de módulo activo */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer con información de permisos */}
      <div className="px-6 py-2 bg-gray-50 border-t">
        <p className="text-xs text-gray-500 text-center">
          Módulos disponibles: {accessibleItems.length} de {NAVIGATION_ITEMS.length}
        </p>
      </div>
    </div>
  );
};

/**
 * Componente simple para mostrar acceso denegado
 */
export const AccessDenied = ({ 
  message = "No tienes permisos para acceder a este módulo",
  showBackButton = true 
}: { 
  message?: string;
  showBackButton?: boolean;
}) => {
  const { getUserDefaultRoute, getUserRoleName } = useAuthData();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <p className="text-sm text-gray-500 mb-6">
          Tu rol actual: <span className="font-medium">{getUserRoleName()}</span>
        </p>
        
        {showBackButton && (
          <Link
            href={getUserDefaultRoute()}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
          >
            Volver al inicio
          </Link>
        )}
      </div>
    </div>
  );
};
