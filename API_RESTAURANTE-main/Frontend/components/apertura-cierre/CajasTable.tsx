import DataTable from "../common/DataTable";
import { BoxDTO } from "@/services/box-service";

interface CajasTableProps {
  cajas: BoxDTO[];
  loading: boolean;
  onRefresh: () => void;
}

export default function CajasTable({ cajas, loading, onRefresh }: CajasTableProps) {
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

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Lista de Cajas Creadas</h5>
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <i className="fas fa-sync-alt me-1"></i>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <DataTable
        headers={["#", "Nombre de la Caja", "Fecha de Creación", "Estado", "Acciones"]}
        title=""
      >
        {loading ? (
          <tr>
            <td colSpan={5} className="text-center py-4">
              <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                Cargando cajas...
              </div>
            </td>
          </tr>
        ) : cajas.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-4 text-muted">
              <i className="fas fa-box-open fa-2x mb-2 d-block text-secondary"></i>
              No hay cajas creadas aún
            </td>
          </tr>
        ) : (
          cajas.map((caja, index) => (
            <tr key={caja.id_box}>
              <td className="fw-medium">{index + 1}</td>
              <td>
                <div className="d-flex align-items-center">
                  <i className="fas fa-box me-2 text-primary"></i>
                  <span className="fw-medium">{caja.name_box}</span>
                </div>
              </td>
              <td>
                <i className="fas fa-calendar-alt me-2 text-muted"></i>
                {formatDate(caja.date)}
              </td>
              <td>
                <span 
                  className={`badge ${
                    caja.is_open 
                      ? 'bg-success' 
                      : 'bg-secondary'
                  }`}
                >
                  <i className={`fas ${caja.is_open ? 'fa-lock-open' : 'fa-lock'} me-1`}></i>
                  {caja.is_open ? 'Abierta' : 'Cerrada'}
                </span>
              </td>
              <td>
                <div className="btn-group btn-group-sm" role="group">
                  <button 
                    className="btn btn-outline-primary"
                    title="Ver detalles"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    className={`btn ${caja.is_open ? 'btn-outline-danger' : 'btn-outline-success'}`}
                    title={caja.is_open ? 'Cerrar caja' : 'Abrir caja'}
                  >
                    <i className={`fas ${caja.is_open ? 'fa-lock' : 'fa-lock-open'}`}></i>
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>
    </div>
  );
}
