"use client";

import { useEffect } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook que monitorea continuamente el estado del token
 * y fuerza el logout cuando detecta expiración
 */
export const useTokenMonitor = () => {
  const { token, logout } = useAuth();

  useEffect(() => {
    if (!token) return;

    // Verificar token cada 30 segundos
    const interval = setInterval(() => {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenPayload.exp * 1000;
        const now = Date.now();

        if (expirationTime <= now) {
          console.warn('🚨 TokenMonitor: Token expirado detectado, forzando logout...');
          clearInterval(interval);
          logout();
        }
      } catch (error) {
        console.error('Error en TokenMonitor:', error);
        clearInterval(interval);
      }
    }, 30000); // Verificar cada 30 segundos

    // Verificación inmediata
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000;
      const now = Date.now();

      if (expirationTime <= now) {
        console.warn('🚨 TokenMonitor: Token ya expirado al inicializar, forzando logout...');
        logout();
      }
    } catch (error) {
      console.error('Error en verificación inmediata de token:', error);
    }

    return () => clearInterval(interval);
  }, [token, logout]);
};
