"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface TokenExpirationWarningProps {
  warningMinutes?: number; // Mostrar advertencia cuando queden X minutos
  className?: string;
}

export const TokenExpirationWarning = ({ 
  warningMinutes = 5, 
  className = '' 
}: TokenExpirationWarningProps) => {
  const { token } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (!token) {
      setShowWarning(false);
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000;

      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = expirationTime - now;
        const remainingMinutes = Math.floor(remaining / (1000 * 60));

        setTimeRemaining(remainingMinutes);
        setShowWarning(remaining > 0 && remainingMinutes <= warningMinutes);

        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error al decodificar token:', error);
      setShowWarning(false);
    }
  }, [token, warningMinutes]);

  if (!showWarning) {
    return null;
  }

  return (
    <div className={`alert alert-warning alert-dismissible fade show ${className}`} role="alert">
      <div className="d-flex align-items-center">
        <i className="fas fa-exclamation-triangle me-2"></i>
        <div>
          <strong>¡Atención!</strong> Su sesión expirará en {timeRemaining} minuto{timeRemaining !== 1 ? 's' : ''}.
          <br />
          <small>Guarde sus cambios para evitar pérdida de datos.</small>
        </div>
      </div>
      <button 
        type="button" 
        className="btn-close" 
        data-bs-dismiss="alert" 
        aria-label="Close"
      ></button>
    </div>
  );
};
