import "@/styles/common.css"

export default function FilterDateRange() {
  return (
    <div>
      <form id="filterForm" className="row g-3">
        <div className="col-md-6">
          <label htmlFor="dateStart" className="foodly-form-label">
            Fecha Inicial
          </label>
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <i className="fas fa-calendar-alt"></i>
            </span>
            <input type="date" id="dateStart" className="foodly-form-control" />
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="dateEnd" className="foodly-form-label">
            Fecha Final
          </label>
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <i className="fas fa-calendar-check"></i>
            </span>
            <input type="date" id="dateEnd" className="foodly-form-control" />
          </div>
        </div>
        <div className="col-12 d-flex gap-2 mt-3">
          <button type="button" className="foodly-btn flex-grow-1">
            <i className="fas fa-search me-2"></i> Filtrar
          </button>
          <button type="reset" className="foodly-btn" style={{ backgroundColor: '#6c757d' }}>
            <i className="fas fa-redo-alt me-2"></i> Limpiar
          </button>
        </div>
      </form>
    </div>
  )
}
