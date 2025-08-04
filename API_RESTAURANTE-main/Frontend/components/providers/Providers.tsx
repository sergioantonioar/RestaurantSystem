'use client'

import { ReactNode } from 'react'
import { IconContext } from 'react-icons'
import { AnimatePresence } from 'framer-motion'
import BootstrapClient from './BootstrapClient'

interface ProvidersProps {
  children: ReactNode
}

// Este componente agrupa todos los proveedores necesarios para la aplicación
export default function Providers({ children }: ProvidersProps) {
  return (
    <IconContext.Provider value={{ className: 'react-icons' }}>
      <AnimatePresence>
        {children}
      </AnimatePresence>
      <BootstrapClient />
    </IconContext.Provider>
  )
}
