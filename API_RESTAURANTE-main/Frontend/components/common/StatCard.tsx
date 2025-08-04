"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

type StatCardVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: StatCardVariant;
  trend?: number;
  trendLabel?: string;
  className?: string;
  index?: number; // Para animación escalonada
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  variant = 'primary',
  trend,
  trendLabel,
  className = '',
  index = 0
}: StatCardProps) {
  // Color según variante
  const getVariantColors = (variant: StatCardVariant) => {
    const colors = {
      primary: {
        bg: 'var(--primary-light)',
        text: 'var(--primary)',
        border: 'var(--primary)',
        iconBg: 'var(--primary)'
      },
      secondary: {
        bg: '#f8f9fa',
        text: '#6c757d',
        border: '#6c757d',
        iconBg: '#6c757d'
      },
      success: {
        bg: '#e8f5e9',
        text: '#2e7d32',
        border: '#2e7d32',
        iconBg: '#2e7d32'
      },
      danger: {
        bg: '#ffebee',
        text: '#c62828',
        border: '#c62828',
        iconBg: '#c62828'
      },
      warning: {
        bg: '#fff8e1',
        text: '#f57f17',
        border: '#f57f17',
        iconBg: '#f57f17'
      },
      info: {
        bg: '#e1f5fe',
        text: '#0277bd',
        border: '#0277bd',
        iconBg: '#0277bd'
      },
    };
    return colors[variant];
  };

  const colors = getVariantColors(variant);
  
  // Dirección de la tendencia
  const isTrendPositive = trend !== undefined ? trend > 0 : undefined;
  const isTrendNeutral = trend !== undefined ? trend === 0 : undefined;

  return (
    <motion.div 
      className={cn("card border-0 shadow-sm h-100", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-uppercase text-muted fs-xs mb-1">{title}</h6>
            <h4 className="mb-1 fs-4 fw-bold" style={{ color: colors.text }}>{value}</h4>
            {subtitle && <div className="text-muted small">{subtitle}</div>}
            
            {trend !== undefined && (
              <div className="mt-2 d-flex align-items-center">
                <div 
                  className={cn("trend-badge fs-xs", {
                    "text-success": isTrendPositive,
                    "text-danger": !isTrendPositive && !isTrendNeutral,
                    "text-muted": isTrendNeutral
                  })}
                >
                  {isTrendPositive && <span>▲</span>}
                  {!isTrendPositive && !isTrendNeutral && <span>▼</span>}
                  {isTrendNeutral && <span>■</span>}
                  <span className="ms-1">
                    {Math.abs(trend)}% {trendLabel || 'vs anterior'}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {icon && (
            <div 
              className="stat-icon d-flex align-items-center justify-content-center rounded-circle" 
              style={{ 
                backgroundColor: colors.bg,
                width: "50px", 
                height: "50px",
                color: colors.iconBg
              }}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
      <div 
        className="stat-indicator" 
        style={{ 
          height: "4px", 
          backgroundColor: colors.border 
        }}
      ></div>
    </motion.div>
  );
}
