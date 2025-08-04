"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface TokenTimeRemainingProps {
  className?: string;
}

export const TokenTimeRemaining = ({ className = '' }: TokenTimeRemainingProps) => {
  const { token, logout } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  useEffect(() => {
    if (!token) {
      setTimeRemaining('');
      return;
    }    // Decodificar el token JWT para obtener la fecha de expiración
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000; // Convertir a millisegundos
      
      // Verificar inmediatamente si el token ya está expirado
      const now = Date.now();
      if (expirationTime <= now) {
        console.warn('Token ya expirado al cargar componente, ejecutando logout...');
        setTimeRemaining('Expirado');
        setIsExpiringSoon(true);
        setTimeout(() => {
          logout();
        }, 500);
        return;
      }

      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = expirationTime - now;        if (remaining <= 0) {
          setTimeRemaining('Expirado');
          setIsExpiringSoon(true);
          clearInterval(interval);
          
          // Forzar logout cuando el token expire
          console.warn('Token expirado detectado en TokenTimeRemaining, ejecutando logout...');
          setTimeout(() => {
            logout();
          }, 1000); // Dar tiempo para que se vea el mensaje "Expirado"
          
          return;
        }

        // Calcular tiempo restante
        const minutes = Math.floor(remaining / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        // Marcar como "expirando pronto" si quedan menos de 5 minutos
        setIsExpiringSoon(minutes < 5);

        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error al decodificar token:', error);
      setTimeRemaining('Error');
    }
  }, [token]);

  if (!token || !timeRemaining) {
    return null;
  }

  return (
    <div className={`token-time-remaining ${className}`}>
      <small 
        className={`text-${isExpiringSoon ? 'warning' : 'muted'}`}
        title="Tiempo restante de sesión"
      >
        <i className="fas fa-clock me-1"></i>
        {timeRemaining}
      </small>
    </div>
  );
};
