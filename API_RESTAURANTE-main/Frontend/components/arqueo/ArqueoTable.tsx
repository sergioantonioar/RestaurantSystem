import DataTable from "../common/DataTable"

// Interfaz que representa un arqueo de caja, con los campos principales que devuelve el backend
export interface Arqueo {
  id_arching: string; // ID único del arqueo
  date: string; // Fecha del arqueo
  star_time: string; // Hora de inicio
  end_time: string | null; // Hora de cierre (null si está abierto)
  init_amount: number; // Monto inicial
  final_amount: number | null; // Monto final (null si está abierto)
  total_amount: number | null; // Total calculado (null si está abierto)
  box: {
    id_box: string;
    name_box: string;
    date: string;
    is_open: boolean;
  };
}

// Props del componente de tabla de arqueos
interface Props {
  arqueos: Arqueo[]; // Lista de arqueos a mostrar
  loading?: boolean; // Estado de carga opcional
  onView?: (arqueo: Arqueo) => void; // Callback para ver detalles
}

/**
 * Tabla de arqueos de caja
 * Muestra la lista de arqueos y permite ver detalles en un modal
 */
export default function ArqueoTable({ arqueos, loading, onView }: Props) {
  return (
    <DataTable
      headers={[
        "#", // Índice
        "Fecha",
        "Hora Inicio",
        "Hora Fin",
        "Monto Inicial",
        "Monto Final",
        "Total",
        "Caja",
        "Acciones",
      ]}
    >
      {/* Renderizar cada fila de arqueo */}
      {arqueos.map((arqueo, idx) => {
        // Determinar si la caja está abierta (sin cierre)
        const abierta = arqueo.final_amount === null || arqueo.total_amount === null;
        return (
          <tr key={arqueo.id_arching}>
            {/* Índice */}
            <td>{idx + 1}</td>
            {/* Fecha */}
            <td>{arqueo.date}</td>
            {/* Hora de inicio */}
            <td>{arqueo.star_time}</td>
            {/* Hora de cierre o estado */}
            <td>{arqueo.end_time ? arqueo.end_time : (abierta ? 'Caja aún abierta' : '-')}</td>
            {/* Monto inicial */}
            <td>{arqueo.init_amount?.toFixed(2)}</td>
            {/* Monto final o mensaje si está abierto */}
            <td>{
              arqueo.final_amount !== null
                ? arqueo.final_amount.toFixed(2)
                : (abierta ? 'Aún sin cierre' : '-')
            }</td>
            {/* Total o mensaje si está abierto */}
            <td>{
              arqueo.total_amount !== null
                ? arqueo.total_amount.toFixed(2)
                : (abierta ? 'Aún sin cierre' : '-')
            }</td>
            {/* Nombre de la caja */}
            <td>{arqueo.box?.name_box || '-'}</td>
            {/* Botón para ver detalles en modal */}
            <td className="text-center">
              <button className="btn btn-link p-0" title="Ver detalles" onClick={() => onView && onView(arqueo)}>
                <i className="fas fa-eye" style={{fontSize: '1.2em', color: '#007bff'}}></i>
              </button>
            </td>
          </tr>
        );
      })}
    </DataTable>
  );
}