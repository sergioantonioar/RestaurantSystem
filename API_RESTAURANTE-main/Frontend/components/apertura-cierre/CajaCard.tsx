import "@/styles/common.css"
import { useState, useEffect } from "react"
import { BoxDTO } from "@/services/box-service"

interface User {
  id: string;
  name: string;
  email: string;
  dni: string;
  role: string;
}

interface CajaCardProps {
  cajas: BoxDTO[]
  loading: boolean
  onRefresh?: () => void
  onActivarCaja?: (cajaId: string) => void
  onToggleCaja?: (cajaId: string) => void
  user: User | null
  isAdmin: boolean
  cajasAsignadas?: Map<string, string> // Mapa de cajas asignadas a ATMs (ID caja -> ID atm)
}

export default function CajaCard({ cajas, loading, onRefresh, onActivarCaja, onToggleCaja, user, isAdmin, cajasAsignadas = new Map() }: CajaCardProps) {
  // Estado local para rastrear cuando fue la última actualización
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Efecto para actualización automática periódica (sin botón manual)
  useEffect(() => {
    // Solo actualizar automáticamente si se proporciona la función onRefresh
    if (!onRefresh) return;

    // Configurar intervalo de actualización (cada 60 segundos)
    const intervalId = setInterval(() => {
      console.log("🔄 Actualizando datos automáticamente desde CajaCard");
      onRefresh();
      setLastRefresh(new Date());
    }, 60000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [onRefresh]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Función para verificar si una caja está asignada a un ATM según el mapa global
  const isCajaAsignada = (cajaId: string): boolean => {
    // Verificar primero si la caja tiene un ATM asignado en sus propios datos
    const caja = cajas.find(c => c.id_box === cajaId);
    if (caja?.atm) {
      console.log(`✅ Caja ${cajaId} tiene ATM asignado en sus propios datos:`, caja.atm.id_atm);
      return true;
    }
    
    // Si no, verificar en el mapa global de asignaciones
    const estaAsignada = cajasAsignadas.has(cajaId);
    if (estaAsignada) {
      console.log(`✅ Caja ${cajaId} tiene ATM asignado según el mapa global:`, cajasAsignadas.get(cajaId));
    }
    return estaAsignada;
  };
  
  // Función para obtener el ATM asignado a una caja (combina datos locales y globales)
  const getATMForCaja = (cajaId: string): any => {
    // Buscar la caja en el estado local
    const caja = cajas.find(c => c.id_box === cajaId);
    
    // Si la caja tiene datos de ATM, usarlos
    if (caja?.atm) {
      return caja.atm;
    }
    
    // Si no tiene datos pero está en el mapa global, buscar el ATM correspondiente
    if (cajasAsignadas.has(cajaId)) {
      const atmId = cajasAsignadas.get(cajaId);
      // En este caso solo tenemos el ID del ATM, buscar el objeto completo
      // Podríamos devolver un objeto mínimo con solo el ID si no lo encontramos
      return { 
        id_atm: atmId, 
        name_atm: `ATM ${atmId?.substring(0, 8)}...` // Mostrar parte del ID si no tenemos el nombre
      };
    }
    
    // Si no está asignada, devolver null
    return null;
  };

  // Ordenar cajas por fecha de creación (más recientes primero)
  const sortedCajas = [...cajas].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <>
      <div className="foodly-card fade-in-up">
        <div className="foodly-card-body pt-4">
          {/* Indicador de última actualización */}
          <div className="mb-3">
            <small className="text-muted d-flex align-items-center" style={{ fontSize: '11px' }}>
              <i className="fas fa-clock me-2"></i>
              Última actualización: {lastRefresh.toLocaleTimeString()}
            </small>
          </div>
          {/* Mensaje para cuando no hay cajas */}
          {sortedCajas.length === 0 && !loading ? (
            <div className="text-center mb-4">
              <div className="mb-4">
                <i className="fas fa-box-open" style={{ fontSize: '60px', color: 'var(--primary)' }}></i>
              </div>
              <p className="mb-3" style={{ fontSize: '16px', color: 'var(--text-medium)' }}>
                {isAdmin 
                  ? 'No hay cajas creadas. Utilice el botón "Crear Caja" en la parte superior para agregar una nueva.'
                  : 'No hay cajas creadas. Solo los administradores pueden crear cajas.'
                }
              </p>
            </div>
          ) : null}

          {/* Grid de cajas rediseñado - Más limpio y moderno */}
          {(sortedCajas.length > 0 || loading) && (
            <div className="row">
              {loading ? (
                <div className="col-12">
                  <div className="text-center py-4">
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      Cargando cajas...
                    </div>
                  </div>
                </div>
              ) : sortedCajas.length === 0 ? (
                <div className="col-12">
                  <div className="text-center py-4 text-muted">
                    <i className="fas fa-box-open fa-2x mb-2 d-block text-secondary"></i>
                    No hay cajas creadas aún
                  </div>
                </div>
              ) : (
                sortedCajas.map((caja) => (
                  <div key={caja.id_box} className="col-md-6 col-lg-4 mb-4">
                    <div 
                      className="card h-100 shadow-sm position-relative overflow-hidden"
                      style={{
                        borderRadius: '20px',
                        border: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        height: '200px',
                        cursor: 'pointer',
                        background: !isCajaAsignada(caja.id_box) ? 
                          'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' :
                          caja.is_open ? 
                          'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)' :
                          'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      {/* Barra superior de color */}
                      <div 
                        style={{
                          height: '4px',
                          background: !caja.atm ? '#6c757d' :
                                    caja.atm && caja.is_open ? '#28a745' :
                                    '#ff6b35',
                          width: '100%'
                        }}
                      />

                      <div className="card-body p-4 d-flex flex-column h-100">
                        {/* Header con nombre y estado */}
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="d-flex align-items-center">
                            <div 
                              className="d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: !isCajaAsignada(caja.id_box) ? '#6c757d' :
                                          caja.is_open ? '#28a745' :
                                          '#ff6b35',
                                color: 'white'
                              }}
                            >
                              <i 
                                className={`fas ${
                                  !isCajaAsignada(caja.id_box) ? 'fa-lock' :
                                  caja.is_open ? 'fa-play' :
                                  'fa-pause'
                                }`}
                                style={{ fontSize: '16px' }}
                              />
                            </div>
                            <div>
                              <h6 className="mb-0 fw-bold" style={{ fontSize: '15px', color: '#2c3e50' }}>
                                {caja.name_box}
                              </h6>
                              <small className="text-muted" style={{ fontSize: '11px' }}>
                                {formatDate(caja.date)}
                              </small>
                            </div>
                          </div>
                          
                          {/* Badge compacto */}
                          <span 
                            className="badge rounded-pill px-2 py-1"
                            style={{
                              background: !isCajaAsignada(caja.id_box) ? '#6c757d' :
                                        caja.is_open ? '#28a745' :
                                        '#ff6b35',
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: '600'
                            }}
                          >
                            {!isCajaAsignada(caja.id_box) ? 'SIN ATM' :
                             caja.is_open ? 'ACTIVA' :
                             'PAUSADA'}
                          </span>
                        </div>

                        {/* Info del empleado o mensaje */}
                        <div className="flex-grow-1 mb-3">
                          {isCajaAsignada(caja.id_box) ? (
                            <div>
                              <div className="d-flex align-items-center">
                                <div 
                                className="d-flex align-items-center justify-content-center me-2"
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '6px',
                                  background: 'rgba(52, 152, 219, 0.1)',
                                  color: '#3498db'
                                }}
                              >
                                <i className="fas fa-user" style={{ fontSize: '10px' }}/>
                              </div>
                              <div>
                                <p className="mb-0 fw-semibold" style={{ fontSize: '13px', color: '#2c3e50' }}>
                                  {(() => {
                                    const atmData = getATMForCaja(caja.id_box);
                                    return atmData ? 
                                      (atmData.name_atm || atmData.alias || `ATM ${atmData.id_atm}`) :
                                      "Empleado asignado";
                                  })()}
                                </p>
                                <small className="text-muted" style={{ fontSize: '10px' }}>
                                  {(() => {
                                    const atmData = getATMForCaja(caja.id_box);
                                    if (atmData && atmData.email) {
                                      return <span><i className="fas fa-envelope me-1" style={{ fontSize: '8px' }}></i>{atmData.email}</span>;
                                    }
                                    if (atmData && atmData.alias) {
                                      return <span><i className="fas fa-at me-1" style={{ fontSize: '8px' }}></i>{atmData.alias}</span>;
                                    }
                                    return "Empleado asignado";
                                  })()}
                                </small>
                              </div>
                              </div>
                              
                              {/* Indicador de caja configurada */}
                              <div className="mt-2 pt-2 border-top">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex align-items-center">
                                    <div 
                                      className={`me-2`} 
                                      style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: caja.is_open ? '#28a745' : '#ffc107'
                                      }}
                                    ></div>
                                    <small style={{ fontSize: '10px', fontWeight: 500 }}>
                                      Estado: <span className={`${caja.is_open ? 'text-success' : 'text-warning'} fw-semibold`}>
                                        {caja.is_open ? 'Abierta' : 'Cerrada'}
                                      </span>
                                    </small>
                                  </div>
                                  <small className="text-muted" style={{ fontSize: '9px', fontWeight: 600 }}>
                                    CAJA CONFIGURADA
                                  </small>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <i className="fas fa-user-slash text-muted mb-1" style={{ fontSize: '20px' }}/>
                              <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>
                                Requiere empleado<br/>para funcionar
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Botón de acción compacto */}
                        <div className="mt-auto">
                          {/* Verificar tanto en la data local como en el mapa global */}
                          {!isCajaAsignada(caja.id_box) ? (
                            // Solo mostrar botón "Asignar Empleado" si el usuario es admin
                            isAdmin ? (
                              <button 
                                className="btn w-100 fw-semibold"
                                style={{ 
                                background: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                transition: 'all 0.3s ease'
                              }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#2980b9';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#3498db';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}
                                onClick={() => {
                                  console.log("🔘 Asignar empleado:", caja.id_box);
                                  onActivarCaja?.(caja.id_box);
                                }}
                              >
                                <i className="fas fa-user-plus me-2"></i>
                                Asignar Empleado
                              </button>
                            ) : (
                              // Mensaje mejorado para usuarios no admin
                              <div 
                                className="text-center py-2 px-3 rounded"
                                style={{
                                  background: 'rgba(108, 117, 125, 0.1)',
                                  border: '1px dashed #6c757d'
                                }}
                              >
                                <i className="fas fa-shield-alt text-muted mb-1" style={{ fontSize: '14px' }}></i>
                                <div>
                                  <small className="text-muted d-block" style={{ fontSize: '10px', fontWeight: '500' }}>
                                    ACCESO RESTRINGIDO
                                  </small>
                                  <small className="text-muted" style={{ fontSize: '9px' }}>
                                    Solo administradores
                                  </small>
                                </div>
                              </div>
                            )
                          ) : (caja as any).isLoading ? (
                            <button 
                              className="btn w-100 fw-semibold"
                              style={{ 
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                transition: 'all 0.3s ease',
                                opacity: '0.8'
                              }}
                              disabled
                            >
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Procesando...
                            </button>
                          ) : caja.is_open ? (
                            <button 
                              className="btn w-100 fw-semibold"
                              style={{ 
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)'
                              }}
                              onClick={() => onToggleCaja?.(caja.id_box)}
                            >
                              <i className="fas fa-lock me-2"></i>
                              Cerrar Caja
                            </button>
                          ) : (
                            <button 
                              className="btn w-100 fw-semibold"
                              style={{ 
                                background: '#27ae60',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 8px rgba(39, 174, 96, 0.3)'
                              }}
                              onClick={() => onToggleCaja?.(caja.id_box)}
                            >
                              <i className="fas fa-play me-2"></i>
                              Activar Caja
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
