"use client";

import { useState } from "react";

interface ArqueoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (arqueoData: ArqueoInitDTO) => void;
  isLoading: boolean;
  cajaNombre: string;
}

export interface ArqueoInitDTO {
  init_amount: number;
}

export default function ArqueoModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  cajaNombre 
}: ArqueoModalProps) {
  const [initialAmount, setInitialAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const handleInputChange = (value: number) => {
    setInitialAmount(value);
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const validateForm = (): boolean => {
    if (!initialAmount || initialAmount <= 0) {
      setError('El monto inicial debe ser mayor a 0');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({ init_amount: initialAmount });
  };

  const handleClose = () => {
    // Resetear formulario al cerrar
    setInitialAmount(0);
    setError('');
    onClose();
  };

  if (!isOpen) {
    console.log("❌ ArqueoModal no se renderiza porque isOpen es false");
    return null;
  }

  console.log("✅ ArqueoModal se está renderizando", { isOpen, cajaNombre, isLoading });

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-calculator me-2"></i>
              Arqueo Inicial - {cajaNombre}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={handleClose}
              disabled={isLoading}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="alert alert-info d-flex align-items-center mb-4">
                <i className="fas fa-info-circle me-2"></i>
                <div>
                  <strong>Arqueo Obligatorio:</strong> Para abrir una caja es necesario registrar el monto inicial con el que se comenzará a operar.
                </div>
              </div>

              {/* Monto inicial */}
              <div className="mb-3">
                <label htmlFor="initial_amount" className="form-label">
                  <i className="fas fa-dollar-sign me-2"></i>
                  Monto Inicial <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    id="initial_amount"
                    value={initialAmount || ''}
                    onChange={(e) => handleInputChange(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                    required
                    autoFocus
                  />
                  {error && (
                    <div className="invalid-feedback">
                      {error}
                    </div>
                  )}
                </div>
                <div className="form-text">
                  Ingrese el monto en efectivo con el que se iniciará la caja.
                </div>
              </div>

              {/* Resumen simplificado */}
              <div className="border rounded p-3 bg-light">
                <h6 className="mb-2">
                  <i className="fas fa-clipboard-list me-2"></i>
                  Resumen del Arqueo
                </h6>
                <ul className="list-unstyled mb-0">
                  <li><strong>Caja:</strong> {cajaNombre}</li>
                  <li><strong>Monto Inicial:</strong> ${initialAmount?.toFixed(2) || '0.00'}</li>
                </ul>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                <i className="fas fa-times me-2"></i>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Abriendo Caja...
                  </>
                ) : (
                  <>
                    <i className="fas fa-unlock me-2"></i>
                    Abrir Caja
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
