
"use client";
import "@/styles/common.css"

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_BASE_URL } from "@/services/api";

export default function PedidoList() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Obtener id_arching vigente
  const getIdArchingVigente = async (userToken: string) => {
    const archingRes = await axios.get(`${API_BASE_URL}arching/list`, {
      params: { page: 0 },
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!archingRes.data || archingRes.data.status !== 200 || !Array.isArray(archingRes.data.data)) {
      return null;
    }
    const arqueoVigente = archingRes.data.data.find((a: any) => a.end_time === null && a.arching_with_box_and_atm?.boxDTO?.is_open);
    return arqueoVigente ? arqueoVigente.id_arching : null;
  };

  // Obtener pedidos recientes
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      const localToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const cookieToken = Cookies.get("token");
      const userToken = localToken || cookieToken || null;
      if (!userToken) {
        setPedidos([]);
        setError("No hay sesión activa.");
        setLoading(false);
        return;
      }
      const id_arching = await getIdArchingVigente(userToken);
      if (!id_arching) {
        setPedidos([]);
        setError("No hay arqueo abierto.");
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_BASE_URL}orderSet/list/ByArching/${id_arching}`, {
        params: { page: 0 },
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.data && res.data.status === 200 && Array.isArray(res.data.data)) {
        setPedidos(res.data.data);
      } else {
        setPedidos([]);
      }
    } catch (err) {
      setError("No se pudieron cargar los pedidos recientes.");
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener detalles de pedido por id_order_set
  const fetchPedidoDetalle = async (id_order_set: string) => {
    setLoadingDetalle(true);
    try {
      const localToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const cookieToken = Cookies.get("token");
      const userToken = localToken || cookieToken || null;
      if (!userToken) {
        setPedidoSeleccionado(null);
        setLoadingDetalle(false);
        return;
      }
      const res = await axios.get(`${API_BASE_URL}orderSet/${id_order_set}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.data && res.data.status === 200 && res.data.data) {
        setPedidoSeleccionado(res.data.data);
      } else {
        setPedidoSeleccionado(null);
      }
    } catch (err) {
      setPedidoSeleccionado(null);
    } finally {
      setLoadingDetalle(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
    // Actualización automática al crear pedido
    const handlePedidoCreado = () => {
      fetchPedidos();
    };
    window.addEventListener('pedidoCreado', handlePedidoCreado);
    return () => {
      window.removeEventListener('pedidoCreado', handlePedidoCreado);
    };
    // eslint-disable-next-line
  }, []);
  // Función para descargar Tiket PDF
  const handleImprimirFactura = async () => {
    if (!pedidoSeleccionado || !pedidoSeleccionado.id_orderSet ) return;
    try {
      const localToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const cookieToken = Cookies.get("token");
      const userToken = localToken || cookieToken || null;
      if (!userToken) return;

      const response = await axios.get(
        `${API_BASE_URL}orderSet/invoice/${pedidoSeleccionado.id_orderSet }`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            Accept: "application/pdf",
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Factura_Pedido_${pedidoSeleccionado.id_orderSet }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar la factura PDF:", error);
      alert("No se pudo generar la factura.");
    }
  };
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 800, paddingTop: 32, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead style={{ backgroundColor: 'var(--primary-light)' }}>
              <tr>
                <th scope="col" style={{ borderTopLeftRadius: '8px' }}>#</th>
                <th scope="col">Cliente</th>
                <th scope="col">Total</th>
                <th scope="col" style={{ borderTopRightRadius: '8px' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted">Cargando pedidos...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="text-center text-danger">{error}</td>
                </tr>
              ) : pedidos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted">No hay pedidos recientes.</td>
                </tr>
              ) : (
                pedidos.map((pedido: any, idx: number) => (
                  <tr key={pedido.id_order_set}>
                    <td>{idx + 1}</td>
                    <td>
                      <i className="fas fa-user-circle me-1" style={{ color: 'var(--primary)' }}></i>
                      {pedido.name_client || '-'}
                    </td>
                    <td style={{ fontWeight: 500 }}>S/.{pedido.total_order ? pedido.total_order.toFixed(2) : '-'}</td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ color: 'var(--primary)', borderColor: 'var(--primary)', backgroundColor: 'var(--primary-light)' }}
                        title="Ver detalles"
                        onClick={() => {
                          setShowDetailModal(true);
                          fetchPedidoDetalle(pedido.id_order_set);
                        }}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* El botón de Actualizar ha sido eliminado. */}
      {/* Modal de detalles del pedido */}
      {showDetailModal && (
        <div
          className="modal fade show"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.15)',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 99,
          }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-md" style={{ margin: 0 }}>
            <div className="modal-content" style={{ borderRadius: 14 }}>
              <div className="modal-header" style={{ background: 'var(--primary-light)', borderRadius: '14px 14px 0 0' }}>
                <h5 className="modal-title" style={{ color: 'var(--primary)', fontWeight: 700 }}>Detalle del Pedido</h5>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => { setShowDetailModal(false); setPedidoSeleccionado(null); }}></button>
              </div>
              <div className="modal-body" style={{ minWidth: 320 }}>
                {loadingDetalle ? (
                  <div className="text-center text-muted">Cargando detalles...</div>
                ) : pedidoSeleccionado ? (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <strong>Cliente:</strong> {pedidoSeleccionado.name_client || '-'}<br />
                      <strong>Total:</strong> S/.{pedidoSeleccionado.total_order ? pedidoSeleccionado.total_order.toFixed(2) : '-'}
                    </div>
                    {Array.isArray(pedidoSeleccionado.orders) && pedidoSeleccionado.orders.length > 0 ? (
                      <div>
                        <strong>Productos:</strong>
                        <table className="table table-bordered table-sm mt-2">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pedidoSeleccionado.orders.map((item: any, idx: number) => (
                              <tr key={idx}>
                                <td>{item.name_product || 'Producto'}</td>
                                <td>{item.count}</td>
                                <td>S/.{item.total_rice ? item.total_rice.toFixed(2) : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <span className="text-muted">No hay productos en este pedido.</span>
                    )}
                  </>
                ) : (
                  <div className="text-center text-danger">No se pudo cargar el detalle del pedido.</div>
                )}
              </div>
              <div className="modal-footer" style={{ justifyContent: 'center' }}>
                <button className="btn btn-success" onClick={handleImprimirFactura}>
                  <i className="fas fa-download me-1"></i> Descargar Ticket
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowDetailModal(false); setPedidoSeleccionado(null); }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
