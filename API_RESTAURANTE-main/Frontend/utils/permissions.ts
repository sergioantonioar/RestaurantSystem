/**
 * Sistema de control de acceso basado en roles
 * Define los roles, permisos y módulos de la aplicación
 */

import { a } from "framer-motion/client";

// Definición de roles
export enum UserRole {
  ADMIN = 'ADMIN',
  ATM = 'ATM', 
  COCINA = 'COCINA'
}

// Definición de módulos/rutas de la aplicación
export enum AppModule {
  // Módulos generales
  APERTURA_CIERRE = '/apertura-cierre',
  APERTURA_CIERRE_ATM = '/apertura-cierre-atm',
  ARQUEO = '/arqueo',
  CONSOLIDADOS = '/consolidados',
  GRAFICOS = '/graficos',
  LOGROS = '/logros',
  EMPLEADOS = '/empleados',
  
  // Módulos de negocio
  PEDIDO = '/pedido',
  PRODUCTOS = '/productos',
  INVENTARIO = '/inventario',
  COCINA = '/cocina',
  
  SUGERENCIAS = '/sugerencias',
  // Módulo de administración
  LOGOUT = '/logout'
}

// Definición de permisos por rol
export const ROLE_PERMISSIONS: Record<UserRole, AppModule[]> = {
  [UserRole.ADMIN]: [
    // ADMIN: acceso completo a toda la aplicación
    AppModule.APERTURA_CIERRE,
    AppModule.ARQUEO,
    AppModule.CONSOLIDADOS,
    AppModule.GRAFICOS,
    AppModule.LOGROS,
    AppModule.EMPLEADOS,
    AppModule.PEDIDO,
    AppModule.PRODUCTOS,
    AppModule.INVENTARIO,
    AppModule.COCINA,
    AppModule.SUGERENCIAS,
    AppModule.LOGOUT
  ],
  
  [UserRole.ATM]: [
    // CAJERO: acceso solo a los módulos de caja y pedidos
    AppModule.APERTURA_CIERRE_ATM,
    AppModule.ARQUEO,
    AppModule.PEDIDO,
    AppModule.SUGERENCIAS,
    AppModule.LOGOUT
  ],
  
  [UserRole.COCINA]: [
    // COCINA: acceso exclusivo al módulo de cocina
    AppModule.COCINA,
    AppModule.LOGOUT
  ]
};

// Rutas de redirección por defecto según el rol
export const DEFAULT_ROUTES: Record<UserRole, string> = {
  [UserRole.ADMIN]: AppModule.APERTURA_CIERRE,
  [UserRole.ATM]: AppModule.APERTURA_CIERRE_ATM,
  [UserRole.COCINA]: AppModule.COCINA
};

/**
 * Verifica si un rol tiene acceso a un módulo específico
 */
export function hasAccess(userRole: string, module: string): boolean {
  const role = userRole as UserRole;
  const permissions = ROLE_PERMISSIONS[role];
  
  if (!permissions) {
    console.warn(`Rol no reconocido: ${userRole}`);
    return false;
  }
  
  return permissions.includes(module as AppModule);
}

/**
 * Obtiene todos los módulos accesibles para un rol
 */
export function getAccessibleModules(userRole: string): AppModule[] {
  const role = userRole as UserRole;
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Obtiene la ruta por defecto para un rol
 */
export function getDefaultRoute(userRole: string): string {
  const role = userRole as UserRole;
  return DEFAULT_ROUTES[role] || '/';
}

/**
 * Verifica si un rol es válido
 */
export function isValidRole(role: string): boolean {
  return Object.values(UserRole).includes(role as UserRole);
}

/**
 * Obtiene el nombre amigable del rol
 */
export function getRoleName(role: string): string {
  const roleNames: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.ATM]: 'Atm',
    [UserRole.COCINA]: 'Cocina'
  };
  
  return roleNames[role as UserRole] || 'Desconocido';
}
