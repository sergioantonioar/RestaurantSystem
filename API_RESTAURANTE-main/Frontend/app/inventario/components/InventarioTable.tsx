"use client"

import { useContext, useEffect, useState } from "react"
import useProductoStock from "../hooks/useProductoStock"
import Cookies from "js-cookie"
import { ProductStock, ProductStockItem } from "../types/productoStok"
import { updateIncrementStockProduct, updateDecrementStockProduct, resetStockProduct, getAllProductStock } from "../services/productStockService"
import DataTable from "@/components/common/DataTable"
import { toast, ToastContainer } from "react-toastify"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import "react-toastify/dist/ReactToastify.css"
import { AuthContext } from "@/context/AuthContext"

const MySwal = withReactContent(Swal)

// Componente principal que muestra y gestiona el inventario de productos
export default function InventarioTable() {
  // Obtener token de autenticación desde el contexto
  const { token } = useContext(AuthContext)

  // Estado para almacenar temporalmente los datos del producto en el modal
  const [formData, setFormData] = useState<Partial<ProductStockItem>>({})

  // Estado para la cantidad a incrementar/decrementar
  const [cantidad, setCantidad] = useState<number>(0)

  // Tipo de operación: entrada o salida de stock
  const [modalType, setModalType] = useState<"increment" | "decrement">("increment")

  // Control de visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Hook personalizado para obtener los productos y su estado de carga
  const [paginaActual, setPaginaActual] = useState(0)
  const { productos, setProductos } = useProductoStock(token, paginaActual)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const localToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
    const cookieToken = Cookies.get("token")
    const userCookie = localToken || cookieToken || null

    if (userCookie) {
      fetchProductos(userCookie, paginaActual)
    }
  }, [paginaActual])

  const fetchProductos = async (userCookie: string, page: number) => {
    setLoading(true)
    try {
      const res = await getAllProductStock(userCookie, page) // ✅ corregido
      setProductos(res.data.data)
    } catch (error) {
      console.error("Error cargando productos", error)
      setProductos([])
    } finally {
      setLoading(false)
    }
  }
  /**
   * Abre el modal con los datos del producto seleccionado y el tipo de operación (entrada o salida).
   */
  const openModal = (producto: ProductStockItem, type: "increment" | "decrement") => {
    setFormData(producto)
    setModalType(type)
    setCantidad(0) // Reinicia la cantidad al abrir el modal
    setIsModalOpen(true)
  }
  /**
   * Actualiza la lista de productos después de realizar una operación de stock.
   * Se llama después de cada operación para reflejar los cambios en la tabla.
   */

  /**
   * Maneja la lógica de envío del modal para incrementar o decrementar stock.
   */
  const handleModalSubmit = async () => {
    if (!token || !formData.product_stock?.id_Stock) {
      toast.error("No se pudo procesar la solicitud. Falta información del producto o el token.")
      return
    }

    if (cantidad <= 0) {
      toast.warn("La cantidad debe ser mayor que cero.")
      return
    }

    try {
      if (modalType === "increment") {
        await updateIncrementStockProduct(formData.product_stock.id_Stock, cantidad, token)
        toast.success("Stock incrementado exitosamente.")
        // Actualizar tabla inventario con los cambios

      } else {
        // Validación para no decrementar más del stock disponible
        if (formData.product_stock && cantidad > formData.product_stock.current_stock) {
          toast.error("No puedes decrementar más stock del disponible.")
          return
        }
        await updateDecrementStockProduct(formData.product_stock.id_Stock, cantidad, token)
        toast.success("Stock decrementado exitosamente.")
        // Actualizar tabla inventario con los cambios
      }

      // Cierra el modal después de la operación
      setIsModalOpen(false)

      // Actualiza localmente el estado del producto con los nuevos valores de stock
      // ✅ Trae la lista actualizada desde la API
      const response = await getAllProductStock(token)
      setProductos(response.data.data)

    } catch (error) {
      console.error("Error actualizando stock:", error)
      toast.error("Error al actualizar el stock del producto.")
    }
  }

  /**
   * Maneja la acción de resetear el stock de un producto después de confirmación del usuario.
   */
  const handleResetStock = async (id_stock: string) => {
    if (!token) return

    const confirm = await MySwal.fire({
      title: "¿Resetear stock del producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, resetear",
      cancelButtonText: "Cancelar",
    })

    if (confirm.isConfirmed) {
      try {
        await resetStockProduct(id_stock, token)
        toast.success("Stock reseteado correctamente")
        // ✅ Trae la lista actualizada desde la API
        const response = await getAllProductStock(token)
        setProductos(response.data.data)
      } catch {
        toast.error("Error al resetear stock")
      }
    }
  }


  return (
    <div className="fade-in-up container-fluid">
      {/* Encabezado de la vista */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Gestión Inventario Productos</h2>
      </div>

      {/* Tabla de productos usando componente reutilizable DataTable */}
      <DataTable
        headers={["#", "Producto", "Inventario Inicial", "Stock Actual", "Inventario Final", "Acciones"]}
        title="Listado de Productos"
      >
        {loading ? (
          <tr>
            <td colSpan={6} className="text-center">Cargando inventario de productos...</td>
          </tr>
        ) : productos.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center">No hay productos registrados en el inventario.</td>
          </tr>
        ) : (
          productos.map((p, i) => (
            <tr key={p.product_stock.id_Stock}>
              <td>{i + 1}</td>
              <td>{p.product_name}</td>
              <td>{p.product_stock.ini_stock}</td>
              <td>{p.product_stock.current_stock}</td>
              <td>{p.product_stock.total_sold}</td>
              <td>
                {/* Botón para entrada de stock */}
                <button
                  className="btn btn-sm btn-outline-success me-2"
                  onClick={() => openModal(p, "increment")}
                >
                  <i className="fa-solid fa-plus"></i> Entrada
                </button>

                {/* Botón para salida de stock */}
                <button
                  className="btn btn-sm btn-outline-danger me-2"
                  onClick={() => openModal(p, "decrement")}
                >
                  <i className="fa-solid fa-minus"></i> Salida
                </button>

                {/* Botón para resetear stock */}
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleResetStock(p.product_stock.id_Stock)}
                >
                  <i className="bi bi-trash" /> Limpiar
                </button>
              </td>
            </tr>
          ))
        )}
        {/* Paginación */}
        <tr>
          <td colSpan={6}>
            <div className="d-flex justify-content-between align-items-center mt-4 px-2">
              <div className="text-muted">
                Página <strong>{paginaActual + 1}</strong>
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${paginaActual === 0 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(prev => Math.max(prev - 1, 0))}
                    >
                      <i className="bi bi-chevron-left" /> Anterior
                    </button>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">{paginaActual + 1}</span>
                  </li>
                  <li className={`page-item ${productos.length < 10 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(prev => prev + 1)}
                    >
                      Siguiente <i className="bi bi-chevron-right" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </td>
        </tr>
      </DataTable>

      {/* Modal de entrada/salida de stock */}
      {isModalOpen && formData && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow rounded-3">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {modalType === "increment" ? "Entrada de Stock" : "Salida de Stock"}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)} />
              </div>
              <div className="modal-body">
                <p><strong>Producto:</strong> {formData.product_name}</p>
                <p><strong>Stock actual:</strong> {formData.product_stock?.current_stock}</p>

                {/* Campo para cantidad */}
                <div className="mb-3">
                  <label className="form-label">Cantidad</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                  />
                </div>

                {/* Campo para observación (no funcional actualmente) */}
                <div className="mb-3">
                  <label className="form-label">Observación</label>
                  <textarea className="form-control" rows={3}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleModalSubmit}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor para notificaciones */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
