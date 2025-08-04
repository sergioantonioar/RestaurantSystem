import MainLayout from "@/components/layout/MainLayout"
import PageHeader from "@/components/common/PageHeader"
import FilterDateRange from "@/components/common/FilterDateRange"
import Card from "@/components/common/Card"

export default function ConsolidadosPage() {
  return (
    <MainLayout>
      <PageHeader title="Arqueo de Caja" icon="fas fa-clipboard-check" />

      <FilterDateRange />

      <Card title="Consolidado de Datos" icon="fas fa-chart-pie" headerClass="bg-info">
        <p>
          <strong>Fecha Inicial:</strong> 2024-10-16 17:09:47
        </p>
        <p>
          <strong>Fecha Final:</strong> 2024-10-16 23:46:31
        </p>
        <p>
          <strong>Ingreso Total:</strong> Efectivo: 865.50, Tarjeta: 748.00, Yape: 724.50, Plin: 23.50
        </p>
        <p>
          <strong>Total en Bruto:</strong> 1613.50
        </p>
        <p>
          <strong>Total Neto:</strong> 1613.50
        </p>
        <button className="btn btn-outline-primary">
          <i className="fas fa-file-pdf"></i> Exportar PDF
        </button>
        <button className="btn btn-outline-success">
          <i className="fas fa-file-excel"></i> Exportar Excel
        </button>
      </Card>
    </MainLayout>
  )
}
