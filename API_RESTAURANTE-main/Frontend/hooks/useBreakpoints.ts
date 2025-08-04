'use client';

import { useEffect, useState } from 'react';

/**
 * Hook personalizado para detectar breakpoints de manera responsiva
 * @returns Objeto con variables booleanas para diferentes tamaños de pantalla
 */
export function useBreakpoints() {
  // Inicializar con valores por defecto para SSR
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    // Handler para actualizar el estado
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Agregar event listener
    window.addEventListener('resize', handleResize);
    
    // Llamar handler inmediatamente para establecer el estado inicial
    handleResize();
    
    // Limpiar event listener al desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Array vacío significa que este efecto se ejecuta una vez al montar
  return {
    isMobile: windowSize.width < 768, // Ajustado para coincidir con las media queries
    isTablet: windowSize.width >= 768 && windowSize.width < 992,
    isDesktop: windowSize.width >= 992,
    isLargeDesktop: windowSize.width >= 1200,
    width: windowSize.width,
    height: windowSize.height
  };
}
