"use client";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function NotificationModal({
  isOpen,
  onClose,
  title,
  message,
  type,
  icon,
  autoClose = false,
  autoCloseDelay = 3000
}: NotificationModalProps) {
  if (!isOpen) return null;

  // Auto-close functionality
  if (autoClose) {
    setTimeout(() => {
      onClose();
    }, autoCloseDelay);
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          headerBg: 'bg-success',
          iconDefault: 'fas fa-check-circle',
          buttonClass: 'btn-success'
        };
      case 'error':
        return {
          headerBg: 'bg-danger',
          iconDefault: 'fas fa-exclamation-circle',
          buttonClass: 'btn-danger'
        };
      case 'warning':
        return {
          headerBg: 'bg-warning',
          iconDefault: 'fas fa-exclamation-triangle',
          buttonClass: 'btn-warning'
        };
      default:
        return {
          headerBg: 'bg-info',
          iconDefault: 'fas fa-info-circle',
          buttonClass: 'btn-info'
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
              className={`btn ${styles.buttonClass}`}
              onClick={onClose}
            >
              <i className="fas fa-check me-1"></i>
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
