"use client";

import React, { useEffect, useState } from "react";
import "@/styles/common.css";
import Cookies from "js-cookie";
import axios from "axios";
import { API_BASE_URL } from "@/services/api";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function PedidoForm() {
  // Modal de confirmación de pedido
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Pedidos recientes
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  // Modal de detalle de pedido
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Obtener pedidos recientes al montar y al finalizar pedido
  const fetchRecentOrders = async () => {
    try {
      setLoadingOrders(true);
      setOrdersError(null);
      const localToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const cookieToken = Cookies.get("token");
      const userToken = localToken || cookieToken || null;
      let id_arching = null;
      if (typeof window !== "undefined") {
        id_arching = localStorage.getItem("id_arching");
      }
      if (!userToken || !id_arching) {
        setRecentOrders([]);
        setLoadingOrders(false);
        return;
      }
      const res = await axios.get(`${API_BASE_URL}orderSet/list/ByArching/${id_arching}`, {
        params: { page: 0 },
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.data && res.data.status === 200 && Array.isArray(res.data.data)) {
        setRecentOrders(res.data.data);
      } else {
        setRecentOrders([]);
      }
    } catch (err) {
      setOrdersError("No se pudieron cargar los pedidos recientes.");
      setRecentOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
    // eslint-disable-next-line
  }, []);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cliente, setCliente] = useState<string>("");
  const [showClienteErrorModal, setShowClienteErrorModal] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Obtener token igual que en los módulos funcionales
        const localToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        const cookieToken = Cookies.get("token");
        const userToken = localToken || cookieToken || null;
        if (!userToken) {
          setCategories([]);
          setProducts([]);
          return;
        }
        // Consumir el endpoint igual que en productos
        const PRODUCT_API_URL = `${API_BASE_URL}product`;
        const res = await axios.get(`${PRODUCT_API_URL}/list?page=0`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (res.data && res.data.status === 200) {
          const productsData = res.data.data || [];
          const mappedProducts: Product[] = productsData.map((p: any) => ({
            id: p.id_product,
            name: p.name_product,
            category: p.category,
            price: p.price,
          }));
          setProducts(mappedProducts);
          // Extraer categorías únicas
          const uniqueCategories = Array.from(new Set(mappedProducts.map((p) => p.category)));
          setCategories(uniqueCategories);
        } else {
          setCategories([]);
          setProducts([]);
        }
      } catch (error) {
        setCategories([]);
        setProducts([]);
      }
    }
    fetchCategories();
  }, []);

  // Filtrar productos por categoría seleccionada
  useEffect(() => {
    async function fetchProductsByCategory() {
      if (!selectedCategory) {
        setFilteredProducts([]);
        return;
      }
      try {
        const localToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        const cookieToken = Cookies.get("token");
        const userToken = localToken || cookieToken || null;
        if (!userToken) {
          setFilteredProducts([]);
          return;
        }
        const PRODUCT_API_URL = `${API_BASE_URL}product`;
        const res = await axios.get(`${PRODUCT_API_URL}/list/category`, {
          params: { category: selectedCategory, page: 0 },
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (res.data && res.data.status === 200) {
          const productsData = res.data.data || [];
          const mappedProducts: Product[] = productsData.map((p: any) => ({
            id: p.id_product,
            name: p.name_product,
            category: p.category,
            price: p.price,
          }));
          setFilteredProducts(mappedProducts);
        } else {
          setFilteredProducts([]);
        }
      } catch (error) {
        setFilteredProducts([]);
      }
    }
    fetchProductsByCategory();
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedProduct("");
  };

  const addToCart = () => {
    if (selectedProduct) {
      const product = filteredProducts.find(p => p.id.toString() === selectedProduct);
      if (product) {
        const existingItem = cart.find(item => item.product.id === product.id);
        if (existingItem) {
          setCart(cart.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ));
        } else {
          setCart([...cart, { product, quantity: 1 }]);
        }
      }
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Obtener id_arching vigente
  const getIdArchingVigente = async (userToken: string) => {
    const archingRes = await axios.get(`${API_BASE_URL}arching/list`, {
      params: { page: 0 },
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!archingRes.data || archingRes.data.status !== 200 || !Array.isArray(archingRes.data.data)) {
      return null;
    }
    // Buscar el arqueo abierto (end_time === null y box.is_open === true)
    const arqueoVigente = archingRes.data.data.find((a: any) => a.end_time === null && a.arching_with_box_and_atm?.boxDTO?.is_open);
    return arqueoVigente ? arqueoVigente.id_arching : null;
  };

  // Manejar el flujo de finalizar pedido
  const handleFinalizarPedido = async () => {
    if (!cliente.trim()) {
      setShowClienteErrorModal(true);
      return;
    }
    try {
      const localToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const cookieToken = Cookies.get("token");
      const userToken = localToken || cookieToken || null;
      if (!userToken) {
        alert("No hay sesión activa. Inicie sesión para continuar.");
        return;
      }
      // Obtener id_arching vigente dinámicamente
      const id_arching = await getIdArchingVigente(userToken);
      if (!id_arching) {
        alert("No hay una caja abierta actualmente. Abra una caja para registrar pedidos.");
        return;
      }
      // Preparar el payload del pedido
      const orderSetPayload = {
        name_cliente: cliente,
        orders: cart.map(item => ({
          id_product: item.product.id,
          count: item.quantity,
        })),
      };
      // Enviar el pedido
      await axios.post(`${API_BASE_URL}orderSet/${id_arching}`, orderSetPayload, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      // Limpiar campos y mostrar modal de éxito
      setCliente("");
      setSelectedCategory("");
      setSelectedProduct("");
      clearCart();
      setShowSuccessModal(true);
      // Actualizar pedidos recientes automáticamente
      fetchRecentOrders();
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new Event('pedidoCreado'));
      }
    } catch (error: any) {
      alert("Ocurrió un error al registrar el pedido. Intente nuevamente.");
    }
  };

  return (
    <div className="foodly-card fade-in-up" style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)', borderRadius: 16, background: '#fff', padding: 0, overflow: 'hidden' }}>
      <div style={{ background: 'var(--primary)', borderRadius: '16px 16px 0 0', padding: '20px 36px 14px 36px', display: 'flex', alignItems: 'center', borderBottom: '2px solid var(--primary)', minHeight: 56, justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.35em', letterSpacing: 0.5, textAlign: 'center', width: '100%' }}>Registro de Pedido</span>
      </div>
      <div className="foodly-card-body" style={{ padding: '32px 32px 24px 32px', background: '#fff' }}>
        <div className="mb-4" style={{ position: 'relative', background: 'var(--primary-light)', borderRadius: 10, padding: 18, marginBottom: 28, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)' }}>
          <label htmlFor="cliente" className="foodly-form-label" style={{ fontWeight: 500, color: 'var(--primary)' }}>
            <i className="fas fa-user me-2" style={{ fontSize: '1.1em', verticalAlign: 'middle' }}></i>
            Cliente
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              id="cliente"
              className="foodly-form-control"
              style={{ borderRadius: 8, border: '1.5px solid var(--primary-light)', paddingLeft: 40, fontSize: '1.05em', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Ingrese el nombre del cliente"
            />
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }}>
              <i className="fas fa-user"></i>
            </span>
          </div>
        </div>
        
        <ul className="nav nav-tabs" style={{ borderBottom: '2px solid var(--primary-light)', marginBottom: 18 }}>
          <li className="nav-item">
            <a 
              className="nav-link active" 
              data-bs-toggle="tab" 
              href="#categorias"
              style={{ color: 'var(--primary)', fontWeight: 500 }}>
              <i className="fas fa-tags me-1"></i>Categorías
            </a>
          </li>
          <li className="nav-item">
            <a 
              className="nav-link" 
              data-bs-toggle="tab" 
              href="#productos"
              style={{ color: 'var(--text-medium)', fontWeight: 500 }}
            >
              <i className="fas fa-list me-1"></i>Productos
            </a>
          </li>
        </ul>

        <div className="tab-content mt-3">
          <div id="categorias" className="tab-pane fade show active" style={{ marginBottom: 24 }}>
            <label htmlFor="categorias-select" className="foodly-form-label" style={{ fontWeight: 500, color: 'var(--primary)' }}>
              <i className="fas fa-folder me-2" style={{ fontSize: '1.1em', verticalAlign: 'middle' }}></i>
              Categoría(s)
            </label>
            <select
              className="foodly-form-control"
              id="categorias-select"
              style={{ borderRadius: 8, border: '1.5px solid var(--primary)', fontSize: '1.08em', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', background: '#fff', fontWeight: 500, color: '#333' }}
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Seleccione una categoría...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div id="productos" className="tab-pane fade" style={{ marginBottom: 24 }}>
            {!selectedCategory ? (
              <div className="alert alert-warning text-center" role="alert" style={{ marginTop: 20 }}>
                <i className="fas fa-exclamation-triangle me-2"></i>
                Primero debes seleccionar una categoría para poder ver los productos disponibles.
              </div>
            ) : (
              <>
                <label htmlFor="productos-select" className="foodly-form-label" style={{ fontWeight: 500, color: 'var(--primary)' }}>
                  <i className="fas fa-utensils me-2" style={{ fontSize: '1.1em', verticalAlign: 'middle' }}></i>
                  Producto(s)
                </label>
                <select
                  className="foodly-form-control"
                  id="productos-select"
                  style={{ borderRadius: 8, border: '1.5px solid var(--primary)', fontSize: '1.08em', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', background: '#fff', fontWeight: 500, color: '#333' }}
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Seleccione un producto...</option>
                  {filteredProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - S/.{product.price.toFixed(2)}
                    </option>
                  ))}
                </select>
                <div className="mt-3">
                  <button 
                    className="foodly-btn"
                    onClick={addToCart}
                    disabled={!selectedProduct}
                    style={
                      !selectedProduct
                        ? {
                            background: 'rgba(255,255,255,0.7)',
                            color: 'var(--primary)',
                            border: '2px solid var(--primary-light)',
                            opacity: 0.5,
                            cursor: 'not-allowed',
                            boxShadow: 'none',
                          }
                        : { background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600 }
                    }
                  >
                    <i className="fas fa-plus me-2"></i>Agregar al Carrito
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 foodly-section" style={{ background: '#fff', borderRadius: 14, padding: 0, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)', marginTop: 32, border: '1.5px solid var(--primary-light)' }}>
          <div style={{ background: 'var(--primary-light)', borderRadius: '14px 14px 0 0', padding: '18px 32px 10px 32px', borderBottom: '1.5px solid var(--primary-light)' }}>
            <h5 className="mb-0" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.15em', letterSpacing: 0.2 }}>Detalle del Pedido</h5>
          </div>
          <div className="table-responsive" style={{ padding: '0 24px' }}>
            <table className="table table-hover" style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: 'none', marginBottom: 0 }}>
              <thead style={{ backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 1 }}>
                <tr style={{ borderBottom: '2px solid var(--primary-light)' }}>
                  <th scope="col" style={{ color: 'var(--primary)', fontWeight: 700, background: '#fff' }}>Producto</th>
                  <th scope="col" style={{ color: 'var(--primary)', fontWeight: 700, background: '#fff' }}>Cantidad</th>
                  <th scope="col" style={{ color: 'var(--primary)', fontWeight: 700, background: '#fff' }}>Precio Unitario</th>
                  <th scope="col" style={{ color: 'var(--primary)', fontWeight: 700, background: '#fff' }}>Subtotal</th>
                  <th scope="col" style={{ color: 'var(--primary)', fontWeight: 700, background: '#fff' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.product.id} style={{ verticalAlign: 'middle', borderBottom: '1.5px solid var(--primary-light)' }}>
                    <td style={{ fontWeight: 500, color: 'var(--primary)', background: '#fff' }}>{item.product.name}</td>
                    <td style={{ background: '#fff' }}>
                      <div className="input-group" style={{ width: '120px' }}>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          style={{ borderRadius: '6px 0 0 6px', borderColor: 'var(--primary-light)' }}
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          className="form-control form-control-sm text-center"
                          value={item.quantity}
                          min="1"
                          style={{ borderColor: 'var(--primary-light)', fontWeight: 600 }}
                          onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                        />
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          style={{ borderRadius: '0 6px 6px 0', borderColor: 'var(--primary-light)' }}
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={{ color: '#444', background: '#fff' }}>S/.{item.product.price.toFixed(2)}</td>
                    <td style={{ color: '#444', background: '#fff' }}>S/.{(item.product.price * item.quantity).toFixed(2)}</td>
                    <td style={{ background: '#fff' }}>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        style={{ borderRadius: 6 }}
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {cart.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted" style={{ fontWeight: 500, padding: 24, background: '#fff' }}>
                      No hay productos en el carrito
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot style={{ backgroundColor: '#fff', fontWeight: 500 }}>
                <tr>
                  <td colSpan={3} className="text-end" style={{ border: 'none', background: '#fff' }}>
                    Subtotal
                  </td>
                  <td colSpan={2} className="text-start" style={{ border: 'none', background: '#fff' }}>
                    S/.{calculateSubtotal().toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-end" style={{ border: 'none', background: '#fff' }}>
                    Impuesto (10%)
                  </td>
                  <td colSpan={2} className="text-start" style={{ border: 'none', background: '#fff' }}>
                    S/.{calculateTax().toFixed(2)}
                  </td>
                </tr>
                <tr style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.08em' }}>
                  <td colSpan={3} className="text-end" style={{ border: 'none', background: '#fff' }}>
                    Total
                  </td>
                  <td colSpan={2} className="text-start" style={{ border: 'none', background: '#fff' }}>
                    S/.{calculateTotal().toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="d-flex justify-content-end mt-3" style={{ padding: '0 24px 18px 24px' }}>
            <button 
              className="foodly-btn me-2" 
              style={{ background: '#fff', color: 'var(--primary)', border: '2px solid var(--primary-light)', fontWeight: 600, boxShadow: 'none' }}
              onClick={clearCart}
            >
              <i className="fas fa-trash-alt me-2"></i>Limpiar Carrito
            </button>
            <button
              className={`foodly-btn${cart.length === 0 ? ' foodly-btn-disabled' : ''}`}
              onClick={handleFinalizarPedido}
              disabled={cart.length === 0}
              style={cart.length === 0 ? {
                background: 'rgba(255,255,255,0.5)',
                color: 'var(--primary)',
                border: '2px solid var(--primary-light)',
                opacity: 0.5,
                cursor: 'not-allowed',
                boxShadow: 'none',
                fontWeight: 600,
                transition: 'background 0.2s',
              } : {
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                boxShadow: 'none',
              }}
            >
              <i className="fas fa-check-circle me-2"></i>Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
      {/* Modal de error de cliente obligatorio */}
      {showClienteErrorModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.25)' }} tabIndex={-1}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content" style={{ borderRadius: 14, textAlign: 'center', padding: '24px 0' }}>
              <div className="modal-header" style={{ background: 'var(--primary-light)', borderRadius: '14px 14px 0 0', justifyContent: 'center' }}>
                <h5 className="modal-title" style={{ color: 'var(--primary)', fontWeight: 700, width: '100%' }}>
                  <i className="fas fa-exclamation-circle me-2" style={{ color: 'var(--primary)', fontSize: '1.5em', verticalAlign: 'middle' }}></i>
                  El nombre del cliente es obligatorio.
                </h5>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'center', paddingBottom: 18 }}>
                <button type="button" className="btn btn-primary" style={{ background: 'var(--primary)', borderRadius: 8, fontWeight: 600, padding: '8px 32px', fontSize: '1.05em' }} onClick={() => setShowClienteErrorModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de confirmación de pedido */}
      {showSuccessModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.25)' }} tabIndex={-1}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content" style={{ borderRadius: 14, textAlign: 'center', padding: '24px 0' }}>
              <div className="modal-header" style={{ background: 'var(--primary-light)', borderRadius: '14px 14px 0 0', justifyContent: 'center' }}>
                <h5 className="modal-title" style={{ color: 'var(--primary)', fontWeight: 700, width: '100%' }}>
                  <i className="fas fa-check-circle me-2" style={{ color: 'var(--primary)', fontSize: '1.5em', verticalAlign: 'middle' }}></i>
                  Pedido realizado exitosamente
                </h5>
              </div>
              <div className="modal-body" style={{ padding: '18px 32px' }}>
                <p style={{ color: '#444', fontWeight: 500, fontSize: '1.08em', marginBottom: 0 }}>
                  ¡El pedido ha sido registrado y guardado correctamente!
                </p>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'center', paddingBottom: 18 }}>
                <button type="button" className="btn btn-primary" style={{ background: 'var(--primary)', borderRadius: 8, fontWeight: 600, padding: '8px 32px', fontSize: '1.05em' }} onClick={() => setShowSuccessModal(false)}>
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}