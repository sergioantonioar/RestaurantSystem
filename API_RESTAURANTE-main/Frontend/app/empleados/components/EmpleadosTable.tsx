"use client"
import { useEffect, useState } from 'react';
import { Empleado } from '../types/empleado';
import { getAllEmpleados, createEmpleado, deleteEmpleado, updateEmpleado, assignUserToAtm } from '../services/empleadoService';
import DataTable from "@/components/common/DataTable"
import ModalPortal from "@/components/common/ModalPortal"
import { toast, ToastContainer } from "react-toastify"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import "react-toastify/dist/ReactToastify.css"
import Cookies from "js-cookie"
import { BsSearch, BsPlusCircle, BsPencil, BsTrash, BsPersonPlus } from "react-icons/bs";

const MySwal = withReactContent(Swal);

export default function EmpleadosTable() {
    const [busqueda, setBusqueda] = useState("");
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string | null>(null); // Simulación de token, debería obtenerse de un contexto o estado global
    // Estado del formulario de producto (crear o editar)
    const [formData, setFormData] = useState<Partial<Empleado>>({})
    const [paginaActual, setPaginaActual] = useState<number>(0);
    const [userData, setUserData] = useState({ username: "", password: "", repeat: "" });

    useEffect(() => {
        const localToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
        const cookieToken = Cookies.get("token")
        const userCookie = localToken || cookieToken || null
        setToken(userCookie)
        if (userCookie) {
            loadEmpleados(userCookie, paginaActual)
        }

    }, [paginaActual]);
    const loadEmpleados = async (token: string, page: number) => {
        setLoading(true);
        try {
            const res = await getAllEmpleados(token, page);
            if (res.data.status === 200) {
                setEmpleados(res.data.data);
            } else {
                setEmpleados([]);
            }
        } catch (error) {
            console.error("Error cargando empleados", error);
            setEmpleados([]);
        } finally {
            setLoading(false);
        }
    };
    // Abrir modal y rellenar datos si es edición
    const openModal = (empleado: Empleado | null) => {
        setFormData(empleado || {})
        const modal = document.getElementById("empleadoModal");
        modal && new (window as any).bootstrap.Modal(modal).show()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    // Guardar o actualizar producto
    const handleSubmit = async () => {
        if (!token) return
        const userCookie = Cookies.get("user")
        const idAdmin = userCookie ? JSON.parse(userCookie).id : null

        try {
            if (formData.id_atm) {
                await updateEmpleado(formData.id_atm, formData, token)
                toast.success("Empleado actualizado")
            } else {
                await createEmpleado(formData as Empleado, idAdmin, token)
                toast.success("Empleado creado")
            }

            // Cerrar modal después de guardar
            const modalEl = document.getElementById("empleadoModal")
            modalEl && (window as any).bootstrap.Modal.getInstance(modalEl).hide()
            const response = await getAllEmpleados(token, 0)
            setEmpleados(response.data.data)
        } catch {
            toast.error("Error al guardar empleado")
        }
    }

    const handleBuscar = async () => {
        if (!token) return
        setLoading(true)
        try {
            const response = await getAllEmpleados(token, 0)
            const filteredEmpleados = response.data.data.filter((empleado: Empleado) =>
                empleado.name_atm.toLowerCase().includes(busqueda.toLowerCase())
            )
            setEmpleados(filteredEmpleados)
        } catch (error) {
            console.error("Error al buscar empleados", error)
            toast.error("Error al buscar empleados")
        } finally {
            setLoading(false)
        }
    }

    const handleAsignar = async () => {
        if (!token || !formData?.id_atm) return;

        if (!userData.username || !userData.password || !userData.repeat) {
            return toast.error("Todos los campos son obligatorios.");
        }

        if (userData.password !== userData.repeat) {
            return toast.error("Las contraseñas no coinciden.");
        }

        try {
            await assignUserToAtm(formData.id_atm, token, {
                username: userData.username,
                password: userData.password,
            });

            toast.success("Usuario asignado correctamente");

            // ✅ Refrescar la tabla de empleados con los nuevos datos
            await loadEmpleados(token, paginaActual);

            // ✅ Cerrar el modal y limpiar datos
            const modalEl = document.getElementById("asignarUsuarioModal");
            modalEl && (window as any).bootstrap.Modal.getInstance(modalEl)?.hide();

            setUserData({ username: "", password: "", repeat: "" });
        } catch (error) {
            console.error(error);
            toast.error("Error al asignar el usuario");
        }
    };
    // Confirmar y eliminar producto
    const handleDelete = async (id: string) => {
        if (!token) return
        const confirm = await MySwal.fire({
            title: "¿Eliminar empleado?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })

        if (confirm.isConfirmed) {
            try {
                await deleteEmpleado(id, token)
                toast.success("Producto eliminado")
                const response = await getAllEmpleados(token, 0)
                setEmpleados(response.data.data)
            } catch {
                toast.error("Error al eliminar")
            }
        }
    }
    return (
        <div className="fade-in-up container-fluid">
            {/* Título y acción principal */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Gestión de Empleados</h2>
                <button className="btn btn-primary" onClick={() => openModal(null)}>
                    <BsPlusCircle /> Nuevo Empleado
                </button>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Listado de Empleados</h5>
                <div className="input-group" style={{ maxWidth: "300px" }}>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Buscar por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <button className="btn btn-sm btn-outline-primary" onClick={handleBuscar}>
                        <BsSearch /> Buscar
                    </button>
                </div>
            </div>

            {/* Tabla de empleados */}
            <DataTable headers={["#", "dni", "Nombre", "Alias", "email", "telefono", "Acciones"]} title="Listado de Empleados">
                {loading ? (
                    <tr><td colSpan={5} className="text-center">Cargando empleados...</td></tr>
                ) : empleados.length === 0 ? (
                    <tr><td colSpan={5} className="text-center">No hay empleados registrados.</td></tr>
                ) : (
                    empleados.map((empleado, i) => (
                        <tr key={empleado.id_atm}>
                            <td>{i + 1}</td>
                            <td>{empleado.dni}</td>
                            <td>{empleado.name_atm}</td>
                            <td>{empleado.alias}</td>
                            <td>{empleado.email}</td>
                            <td>{empleado.phone}</td>
                            <td>
                                {/* Botón de asignación */}
                                {empleado.is_active ? (
                                    <button className="btn btn-outline-secondary btn-sm me-2" disabled>
                                        <BsPersonPlus className="me-1" /> Asignado a Caja
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-outline-success btn-sm me-2"
                                        onClick={() => {
                                            setFormData(empleado);
                                            const modal = document.getElementById("asignarUsuarioModal");
                                            modal && new (window as any).bootstrap.Modal(modal).show();
                                        }}
                                    >
                                        <BsPersonPlus className="me-1" /> Asignar a Cajero
                                    </button>
                                )}


                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openModal(empleado)}>
                                    <BsPencil /> Editar
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(empleado.id_atm)}>
                                    <BsTrash /> Eliminar
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                {/* Paginación */}
                <tr>
                    <td colSpan={7}>
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
                                    <li className={`page-item ${empleados.length < 10 ? "disabled" : ""}`}>
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
            {/* Modal de empleado mejorado */}
            <ModalPortal>
                <div className="modal fade" id="empleadoModal" tabIndex={-1}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0 rounded-4">
                            <div className="modal-header bg-primary text-white rounded-top-4">
                                <h5 className="modal-title d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-user-tie"></i>
                                    {formData.id_atm ? "Editar Cajero" : "Nuevo Cajero"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    data-bs-dismiss="modal"
                                />
                            </div>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label htmlFor="name_atm" className="form-label">Nombre completo</label>
                                    <input
                                        type="text"
                                        name="name_atm"
                                        value={formData.name_atm || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Ej. Carlos Ramírez"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="alias" className="form-label">Alias</label>
                                    <input
                                        type="text"
                                        name="alias"
                                        value={formData.alias || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Ej. cramirez"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Ej. cramirez@atmcorp.com"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Ej. 987654321"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="dni" className="form-label">DNI</label>
                                    <input
                                        type="text"
                                        name="dni"
                                        value={formData.dni || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Ej. 72145678"
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
            {formData && formData.id_atm && (
                <ModalPortal>
                    <div className="modal fade" id="asignarUsuarioModal" tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content shadow-lg rounded-4">
                                <div className="modal-header bg-success text-white">
                                    <h5 className="modal-title">
                                        <BsPersonPlus className="me-2" />
                                        Asignar Usuario a Cajero
                                    </h5>
                                    <button className="btn-close btn-close-white" data-bs-dismiss="modal" />
                                </div>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label">Usuario</label>
                                        <input type="text" className="form-control" name="username" onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Contraseña</label>
                                        <input type="password" className="form-control" name="password" onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Repetir contraseña</label>
                                        <input type="password" className="form-control" name="repeat" onChange={(e) => setUserData({ ...userData, repeat: e.target.value })} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                    <button className="btn btn-success" onClick={handleAsignar}>
                                        <BsPersonPlus className="me-1" /> Asignar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </div>
    )
}
