"use client";

import { useAuthData } from "@/hooks/useAuthData";

export const UserAccessInfo = () => {
  const { 
    user, 
    getUserRoleName, 
    getAccessibleRoutes, 
    canAccess 
  } = useAuthData();

  if (!user) {
    return null;
  }

  const accessibleModules = getAccessibleRoutes();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-3">Información de Acceso</h3>
      
      {/* Información del usuario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Usuario:</label>
          <p className="text-gray-800">{user.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Rol:</label>
          <p className="text-gray-800">{getUserRoleName()}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Email:</label>
          <p className="text-gray-800">{user.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">ID:</label>
          <p className="text-gray-800 font-mono text-sm">{user.id}</p>
        </div>
      </div>

      {/* Módulos accesibles */}
      <div>
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          Módulos Accesibles ({accessibleModules.length}):
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {accessibleModules.map((module) => (
            <div
              key={module}
              className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
            >
              {module.replace('/', '')}
            </div>
          ))}
        </div>
      </div>

      {/* Verificación de acceso específico */}
      <div className="mt-4">
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          Verificación de Acceso:
        </label>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Administrar Empleados:</span>
            <span className={canAccess('/empleados') ? 'text-green-600' : 'text-red-600'}>
              {canAccess('/empleados') ? '✅ Permitido' : '❌ Denegado'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Gestionar Productos:</span>
            <span className={canAccess('/productos') ? 'text-green-600' : 'text-red-600'}>
              {canAccess('/productos') ? '✅ Permitido' : '❌ Denegado'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Módulo de Cocina:</span>
            <span className={canAccess('/cocina') ? 'text-green-600' : 'text-red-600'}>
              {canAccess('/cocina') ? '✅ Permitido' : '❌ Denegado'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Ver Gráficos:</span>
            <span className={canAccess('/graficos') ? 'text-green-600' : 'text-red-600'}>
              {canAccess('/graficos') ? '✅ Permitido' : '❌ Denegado'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
