import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Importar el sistema de permisos
// Nota: Debido a limitaciones del middleware, replicamos la lógica aquí
const UserRole = {
  ADMIN: 'ADMIN',
  ATM: 'ATM', 
  COCINA: 'COCINA'
} as const;

const ROLE_PERMISSIONS: Record<string, string[]> = {
  [UserRole.ADMIN]: [
    '/apertura-cierre',
    '/arqueo',
    '/consolidados',
    '/graficos',
    '/logros',
    '/empleados',
    '/pedido',
    '/productos',
    '/inventario',
    '/cocina',
    '/sugerencias',
    '/logout'
  ],
  [UserRole.ATM]: [
    '/apertura-cierre-atm',
    '/arqueo',
    '/pedido',
    '/sugerencias',
    '/logout'
  ],
  [UserRole.COCINA]: [
    '/cocina',
    '/logout'
  ]
};

const DEFAULT_ROUTES: Record<string, string> = {
  [UserRole.ADMIN]: '/apertura-cierre',
  [UserRole.ATM]: '/apertura-cierre-atm',
  [UserRole.COCINA]: '/cocina'
};

// Rutas que no requieren autenticación
const publicRoutes = ["/"]

function hasAccess(userRole: string, pathname: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;
  
  return permissions.some(route => pathname.startsWith(route));
}

function getDefaultRoute(userRole: string): string {
  return DEFAULT_ROUTES[userRole] || '/';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acceso a rutas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }
  // Verificar si el usuario está autenticado
  const userStr = request.cookies.get("user")?.value

  if (!userStr) {
    // Redirigir al login si no está autenticado
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Verificar token de localStorage a través de headers (si está disponible)
  const authToken = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (authToken) {
    try {
      // Decodificar y verificar expiración del token JWT
      const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000;
      const now = Date.now();
      
      if (expirationTime <= now) {
        console.warn('🚨 Middleware: Token expirado detectado, redirigiendo al login...');
        // Token expirado, redirigir al login
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.delete("user");
        return response;
      }
    } catch (error) {
      console.error('Error al verificar token en middleware:', error);
    }
  }
  try {
    const user = JSON.parse(userStr)
    const role = user.role

    console.log(`🔐 Middleware: Verificando acceso para rol "${role}" a ruta "${pathname}"`);

    // Verificar si el usuario tiene acceso a la ruta solicitada
    const userHasAccess = hasAccess(role, pathname);

    if (!userHasAccess && pathname !== "/logout") {
      console.log(`❌ Middleware: Acceso denegado para rol "${role}" a ruta "${pathname}"`);
      
      // Redirigir a la ruta por defecto según el rol
      const defaultRoute = getDefaultRoute(role);
      console.log(`🔄 Middleware: Redirigiendo a ruta por defecto: ${defaultRoute}`);
      
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }

    console.log(`✅ Middleware: Acceso autorizado para rol "${role}" a ruta "${pathname}"`);
  } catch (error) {
    console.error('❌ Middleware: Error al parsear usuario:', error);
    // Si hay un error al parsear el usuario, redirigir al login
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("user");
    return response;
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
