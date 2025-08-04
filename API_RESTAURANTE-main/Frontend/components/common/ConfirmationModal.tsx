"use client";

import { useState } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
  icon?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = 'info',
  isLoading = false,
  icon
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          headerBg: 'bg-danger',
          confirmBtn: 'btn-danger',
          iconDefault: 'fas fa-exclamation-triangle'
        };
      case 'warning':
        return {
          headerBg: 'bg-warning',
          confirmBtn: 'btn-warning',
          iconDefault: 'fas fa-exclamation-triangle'
        };
      case 'success':
        return {
          headerBg: 'bg-success',
          confirmBtn: 'btn-success',
          iconDefault: 'fas fa-check-circle'
        };
      default:
        return {
          headerBg: 'bg-primary',
          confirmBtn: 'btn-primary',
          iconDefault: 'fas fa-question-circle'
        };
    }
  };

  const styles = getTypeStyles();
  const modalIcon = icon || styles.iconDefault;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div className={`modal-header ${styles.headerBg} text-white`}>
            <h5 className="modal-title d-flex align-items-center">
              <i className={`${modalIcon} me-2`}></i>
              {title}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="d-flex align-items-start">
              <div className="flex-grow-1">
                <p className="mb-0" style={{ lineHeight: '1.6' }}>
                  {message}
                </p>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              <i className="fas fa-times me-1"></i>
              {cancelText}
            </button>
            <button 
              type="button" 
              className={`btn ${styles.confirmBtn}`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Procesando...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-1"></i>
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
