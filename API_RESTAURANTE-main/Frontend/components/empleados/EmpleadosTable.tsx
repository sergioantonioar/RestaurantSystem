// Importación del componente DataTable para mostrar datos tabulares
import DataTable from "../common/DataTable"
// Importación de estilos comunes para mantener la consistencia visual
import "@/styles/common.css"

/**
 * Componente que renderiza una tabla de empleados con sus datos
 * Muestra información detallada de cada empleado y opciones para editarlos
 */
export default function EmpleadosTable() {
  // Array de datos de empleados (en una aplicación real estos datos vendrían de una API)
  const empleados = [
    {
      id: 1,
      alias: "Fuente de Soda",
      correo: "fuentedesoda@gmail.com",
      documento: "475687445789",
      nombre: "FUENTE DE SODA",
      perfil: "Comanda en Pantalla de Cocina",
      estado: "Activo",
    },
    {
      id: 2,
      alias: "Ana F",
      correo: "anaf@gmail.com",
      documento: "865434678",
      nombre: "ANA FUENTE SODA",
      perfil: "Cocinero",
      estado: "Activo",
    },
    {
      id: 3,
      alias: "Sara F",
      correo: "saraf@gmail.com",
      documento: "65787899645",
      nombre: "SARA FUENTE DE SODA",
      perfil: "Colaborador servicio",
      estado: "Activo",
    },
    {
      id: 4,
      alias: "Carla",
      correo: "carlaf@gmail.com",
      documento: "87897070",
      nombre: "CARLA FUENTE DE SODA",
      perfil: "Caja Estándar",
      estado: "Activo",
    },
  ]

  return (
    // Contenedor con animación de aparición
    <div className="fade-in-up">
      {/* Componente DataTable reutilizable con definición de cabeceras */}
      <DataTable 
        headers={["#", "Alias", "Correo", "Documento / Nombre", "Perfil", "Estado", "Acción"]}
        title="Listado de Empleados"
      >
        {/* Mapeo de cada empleado para generar una fila en la tabla */}
        {empleados.map((empleado) => (
          <tr key={empleado.id}>
            <th scope="row">{empleado.id}</th>
            <td>{empleado.alias}</td>
            <td>{empleado.correo}</td>
            {/* Celda con formato especial para mostrar documento y nombre */}
            <td>
              <div>
                <div style={{ fontWeight: '500', color: 'var(--primary)' }}>{empleado.documento}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-medium)' }}>{empleado.nombre}</div>
              </div>
            </td>
            <td>{empleado.perfil}</td>
            {/* Badge condicional que cambia de color según el estado */}
            <td>
              <span className="badge" style={{ 
                backgroundColor: empleado.estado === "Activo" ? 'var(--primary)' : '#dc3545',
                color: 'white',
                padding: '6px 10px',
                borderRadius: '6px'
              }}>
                {empleado.estado}
              </span>
            </td>
            {/* Botón de acción para editar cada empleado */}
            <td>
              <button className="foodly-btn-secondary" style={{ 
                padding: '5px 10px',
                fontSize: '0.9rem'
              }}>
                <i className="fas fa-edit me-1"></i>Editar
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  )
}
