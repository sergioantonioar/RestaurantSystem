'use client'

import { useEffect } from 'react'

// Este componente se encarga de importar los scripts de bootstrap en el lado del cliente
export default function BootstrapClient() {
  useEffect(() => {
    // Importación dinámica de bootstrap para el lado del cliente
    import('bootstrap/dist/js/bootstrap.bundle.min.js').catch((err) => {
      console.error('Error al cargar Bootstrap:', err);
    });
  }, [])

  return null
}
