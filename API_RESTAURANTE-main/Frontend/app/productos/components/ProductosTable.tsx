"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import useProductos from "../hooks/useProductos"
import { Producto } from "../types/producto"
import { createProducto, deleteProducto, getAllProductos, updateProducto } from "../services/productoService"
import DataTable from "@/components/common/DataTable"
import ModalPortal from "@/components/common/ModalPortal"
import { toast, ToastContainer } from "react-toastify"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import "react-toastify/dist/ReactToastify.css"

// Inicializa SweetAlert con React
const MySwal = withReactContent(Swal)

export default function ProductosTable() {
    // Token para autenticación
    const [token, setToken] = useState<string | null>(null)

    // Estado del formulario de producto (crear o editar)
    const [formData, setFormData] = useState<Partial<Producto>>({})

    // Hook para obtener productos y estado de carga
    const [paginaActual, setPaginaActual] = useState(0)
    const { productos, setProductos } = useProductos(token,paginaActual)
    const [loading, setLoading] = useState(true)
    // Obtener token del localStorage o cookie al montar
    useEffect(() => {
        const localToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
        const cookieToken = Cookies.get("token")
        const userCookie = localToken || cookieToken ||  null
        setToken(userCookie)
        if (userCookie) {
            fetchProductos(userCookie,paginaActual)
        }

    }, [paginaActual])
    const fetchProductos = async (userCookie: string, page: number) => {
        setLoading(true)
        try {
            const res = await getAllProductos(userCookie, page)
            setProductos(res.data.data)
        } catch (error) {
            console.error("Error cargando productos", error)
            setProductos([])
        } finally {
            setLoading(false)
        }
    }

    // Abrir modal y rellenar datos si es edición
    const openModal = (producto: Producto | null = null) => {
        setFormData(producto || {})
        const modalEl = document.getElementById("productoModal")
        modalEl && new (window as any).bootstrap.Modal(modalEl).show()
    }    // Manejar cambios en inputs del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Guardar o actualizar producto
    const handleSubmit = async () => {
        if (!token) return
        const userCookie = Cookies.get("user")
        const idAdmin = userCookie ? JSON.parse(userCookie).id : null

        try {
            if (formData.id_product) {
                await updateProducto(formData.id_product, formData, token)
                toast.success("Producto actualizado")
            } else {
                await createProducto(formData as Producto, idAdmin, token)
                toast.success("Producto creado")
            }

            // Cerrar modal después de guardar
            const modalEl = document.getElementById("productoModal")
            modalEl && (window as any).bootstrap.Modal.getInstance(modalEl).hide()
            const response = await getAllProductos(token,0)
                setProductos(response.data.data)
        } catch {
            toast.error("Error al guardar producto")
        }
    }

    // Confirmar y eliminar producto
    const handleDelete = async (id: number) => {
        if (!token) return

        const confirm = await MySwal.fire({
            title: "¿Eliminar producto?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })

        if (confirm.isConfirmed) {
            try {
                await deleteProducto(id, token)
                toast.success("Producto eliminado")
                  const response = await getAllProductos(token,0)
                setProductos(response.data.data)
            } catch {
                toast.error("Error al eliminar")
            }
        }
    }

    return (
        <div className="fade-in-up container-fluid">
            {/* Título y acción principal */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Gestión de Productos</h2>
                <button className="btn btn-primary" onClick={() => openModal(null)}>
                    <i className="bi bi-plus-circle me-1" /> Nuevo Producto
                </button>
            </div>

            {/* Tabla de productos */}
            <DataTable headers={["#", "Nombre", "Categoría", "Precio", "Acciones"]} title="Listado de Productos">
                {loading ? (
                    <tr><td colSpan={5} className="text-center">Cargando productos...</td></tr>
                ) : productos.length === 0 ? (
                    <tr><td colSpan={5} className="text-center">No hay productos registrados.</td></tr>
                ) : (
                    productos.map((p, i) => (
                        <tr key={p.id_product}>
                            <td>{i + 1}</td>
                            <td>{p.name_product}</td>
                            <td>{p.category}</td>
                            <td>S/.{Number(p.price)?.toFixed(2) ?? "0.00"}</td>

                            <td>
                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openModal(p)}>
                                    <i className="bi bi-pencil" /> Editar
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id_product)}>
                                    <i className="bi bi-trash" /> Eliminar
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                {/* Paginación */}
                    <tr>
                        <td colSpan={5}>
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
            {/* Modal de producto mejorado */}
            <ModalPortal>
                <div className="modal fade" id="productoModal" tabIndex={-1}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0 rounded-4">
                            <div className="modal-header bg-primary text-white rounded-top-4">
                                <h5 className="modal-title d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-box"></i>
                                    {formData.id_product ? "Editar Producto" : "Nuevo Producto"}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
                            </div>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label htmlFor="name_product" className="form-label">Nombre del producto</label>
                                    <input
                                        type="text"
                                        name="name_product"
                                        value={formData.name_product || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Ej. Hamburguesa doble"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label">Categoría</label>
                                    <select
                                        name="category" value={formData.category || ""} onChange={handleChange} className="form-select">
                                        <option value="">Seleccionar categoría</option>
                                        <option value="COMIDA_RAPIDA">Comida Rápida</option>
                                        <option value="PASTAS">Pastas</option>
                                        <option value="CRIOLLOS">Criollos</option>
                                        <option value="MARINO">Marino</option>
                                        <option value="BEBIDAS">Bebidas</option>
                                        <option value="OTROS">Otros</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Precio</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Ej. 12.50"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="additional_observation" className="form-label">Observaciones</label>
                                    <textarea
                                        name="additional_observation"
                                        value={formData.additional_observation || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows={3}
                                        placeholder="Ej. Sin cebolla, extra queso..."
                                    />
                                </div>
                            </div>
                            <div className="modal-footer p-3">
                                <button className="btn btn-secondary" data-bs-dismiss="modal">
                                    <i className="fa-solid fa-xmark me-1"></i> Cancelar
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    <i className="fa-solid fa-floppy-disk me-1"></i> Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalPortal>
            {/* Notificaciones tipo Toast */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    )
}
