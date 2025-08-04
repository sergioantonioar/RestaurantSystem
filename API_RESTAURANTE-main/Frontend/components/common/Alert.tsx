"use client";

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiInfo, 
  FiX, 
  FiAlertTriangle 
} from 'react-icons/fi';

type AlertVariant = 'success' | 'danger' | 'warning' | 'info';

interface AlertProps {
  title?: string;
  children: ReactNode;
  variant?: AlertVariant;
  dismissible?: boolean;
  className?: string;
}

export default function Alert({ 
  title, 
  children, 
  variant = 'info',
  dismissible = true,
  className = ''
}: AlertProps) {
  const [visible, setVisible] = useState(true);
  
  if (!visible) return null;

  // Configuración por variante
  const variantConfig = {
    success: { 
      icon: <FiCheckCircle size={20} />, 
      className: 'alert-success',
      bg: 'rgba(25, 135, 84, 0.15)',
      border: 'rgb(25, 135, 84)'
    },
    danger: { 
      icon: <FiAlertCircle size={20} />, 
      className: 'alert-danger',
      bg: 'rgba(220, 53, 69, 0.15)',
      border: 'rgb(220, 53, 69)'
    },
    warning: { 
      icon: <FiAlertTriangle size={20} />, 
      className: 'alert-warning',
      bg: 'rgba(255, 193, 7, 0.15)',
      border: 'rgb(255, 193, 7)'
    },
    info: { 
      icon: <FiInfo size={20} />, 
      className: 'alert-info',
      bg: 'rgba(13, 202, 240, 0.15)',
      border: 'rgb(13, 202, 240)'
    }
  };
  
  const config = variantConfig[variant];
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div          className={cn("alert border-start border-4 d-flex", config.className, className)}
          style={{ 
            backgroundColor: config.bg,
            borderLeftColor: config.border
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="d-flex">
            <div className="me-3">
              {config.icon}
            </div>
            <div className="flex-grow-1">
              {title && <h5 className="alert-heading">{title}</h5>}
              <div>{children}</div>
            </div>
          </div>
          
          {dismissible && (
            <button 
              type="button" 
              className="btn-close ms-2" 
              aria-label="Cerrar"
              onClick={() => setVisible(false)}
            ></button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
