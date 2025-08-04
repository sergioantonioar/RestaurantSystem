interface OrdenProps {
  id: number
  cliente: string
  mesa: string
  estado: "pendiente" | "preparando" | "listo"
  tiempo: string
  items: {
    nombre: string
    cantidad: number
    observacion?: string
  }[]
}

export default function OrdenCard({ id, cliente, mesa, estado, tiempo, items }: OrdenProps) {
  return (
    <div className="foodly-card fade-in-up">
      <div className="foodly-card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="order-number fw-bold">Orden #{id}</div>
          <span
            className={`foodly-badge ${
              estado === "pendiente" ? "foodly-badge-warning" : estado === "preparando" ? "foodly-badge-primary" : "foodly-badge-success"
            }`}
          >
            {estado === "pendiente" ? "Pendiente" : estado === "preparando" ? "Preparando" : "Listo"}
          </span>
        </div>
      </div>
      <div className="foodly-card-body">
        <h5 className="mb-2">
          <i className="fas fa-user me-2 text-primary"></i>{cliente}
        </h5>
        <p className="mb-2">
          <i className="fas fa-chair me-2 text-primary"></i>{mesa}
        </p>
        <div className="order-timer mb-3">
          <i className="fas fa-clock me-2 text-primary"></i>Tiempo: {tiempo}
        </div>
        <div className="order-details mb-3">
          <h6 className="mb-2">Detalle del pedido:</h6>
          <ul className="list-group">
            {items.map((item, index) => (
              <li className="list-group-item border-0 ps-0 py-1" key={index}>
                <div className="d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-2">{item.cantidad}x</span>
                  <span>{item.nombre}</span>
                </div>
                {item.observacion && <div className="text-muted small ms-4">Obs: {item.observacion}</div>}
              </li>
            ))}
          </ul>
        </div>
        {estado === "pendiente" ? (
          <button className="foodly-btn w-100">
            <i className="fas fa-play-circle me-2"></i>Iniciar preparación
          </button>
        ) : estado === "preparando" ? (
          <button className="foodly-btn foodly-btn-secondary w-100">
            <i className="fas fa-check-circle me-2"></i>Marcar como listo
          </button>
        ) : (
          <button className="foodly-btn w-100" disabled>
            <i className="fas fa-check-double me-2"></i>Completado
          </button>
        )}
      </div>
    </div>
  )
}
