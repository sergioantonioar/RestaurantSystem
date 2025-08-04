"use client"

import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import Sidebar from "./Sidebar"
import { useBreakpoints } from "@/hooks/useBreakpoints"
import { useTokenMonitor } from "@/hooks/useTokenMonitor"
import { TokenExpirationAlert } from "@/components/common/TokenExpirationAlert"
import { TokenTimeRemaining } from "@/components/common/TokenTimeRemaining"

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile } = useBreakpoints();
  
  // Monitorear el estado del token constantemente
  useTokenMonitor();
    // Cerrar el sidebar cuando cambiamos de móvil a desktop
  useEffect(() => {
    if (!isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isMobile, sidebarOpen]);
  
  // Efecto para manejar el estado del body cuando el sidebar está abierto en móvil
  useEffect(() => {
    if (isMobile) {
      if (sidebarOpen) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    }
    
    // Limpieza
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen, isMobile]);

  const toggleSidebar = () => {
    console.log("Toggling sidebar, current state:", sidebarOpen);
    setSidebarOpen(prevState => !prevState);
  };
  return (
    <div className="app-container">
      {/* Overlay para cuando el sidebar está abierto en móvil */}
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => {
            console.log("Overlay clicked, closing sidebar");
            toggleSidebar();
          }}
        ></div>
      )}
      
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />      <div id="main" className="container-fluid">
        {/* Botón hamburguesa para mostrar el sidebar en móvil */}        {isMobile && (
          <button 
            className={`hamburger-btn ${sidebarOpen ? 'hidden' : ''}`} 
            onClick={() => {
              console.log("Hamburger button clicked");
              toggleSidebar();
            }}
            aria-label="Abrir menú"
          >
            <i className="fas fa-bars"></i>
          </button>
        )}
        
        {/* Componentes de manejo de expiración de token */}
        <TokenExpirationAlert />
        <TokenTimeRemaining />
        
        {children}
      </div>
    </div>
  )
}
