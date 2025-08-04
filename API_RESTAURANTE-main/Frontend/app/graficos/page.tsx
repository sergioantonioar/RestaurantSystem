import MainLayout from "@/components/layout/MainLayout"
import BarChart from "@/components/charts/BarChart"
import PieChart from "@/components/charts/PieChart"

export default function GraficosPage() {
  return (
    <MainLayout>
      <div className="row mb-3">
        <div className="col-12">
          <h2>Reportes gráficos</h2>
        </div>
      </div>

      <div className="row filter-section mb-4">
        <div className="col-md-12">
          <h5>
            <i className="fas fa-filter"></i> Filtrado
          </h5>
          <form>
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="rango-fecha" className="form-label">
                  Rango de Fecha:
                </label>
                <input
                  type="text"
                  id="rango-fecha"
                  className="form-control"
                  defaultValue="17/jul/2024 03:09 PM"
                  readOnly
                />
              </div>
              <div className="col-md-8">
                <label htmlFor="filtrado-variable" className="form-label">
                  Seleccionar variable de filtrado:
                </label>
                <div className="d-flex align-items-center">
                  <div className="form-check me-3">
                    <input className="form-check-input" type="radio" name="filtrado" id="filtrado-ano" />
                    <label className="form-check-label" htmlFor="filtrado-ano">
                      Año
                    </label>
                  </div>
                  <div className="form-check me-3">
                    <input className="form-check-input" type="radio" name="filtrado" id="filtrado-mes" defaultChecked />
                    <label className="form-check-label" htmlFor="filtrado-mes">
                      Mes
                    </label>
                  </div>
                  <div className="form-check me-3">
                    <input className="form-check-input" type="radio" name="filtrado" id="filtrado-dia" />
                    <label className="form-check-label" htmlFor="filtrado-dia">
                      Día
                    </label>
                  </div>
                  <div className="form-check me-3">
                    <input className="form-check-input" type="radio" name="filtrado" id="filtrado-hora" />
                    <label className="form-check-label" htmlFor="filtrado-hora">
                      Hora
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <BarChart
            id="chartPedidos"
            title="Reporte de total de pedidos"
            labels={["Mesa", "Recojo en tienda"]}
            data={[1500, 2500]}
          />
        </div>

        <div className="col-md-6 mb-4">
          <PieChart id="chartPropinas" title="Reporte de Propinas Totales" labels={["Propinas Totales"]} data={[500]} />
        </div>
      </div>
    </MainLayout>
  )
}
