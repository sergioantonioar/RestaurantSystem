// Directiva para marcar este componente como Cliente, necesario para manipular el DOM
"use client"

// Importaciones necesarias
import { useEffect } from "react"                    // Hook para efectos secundarios
import MainLayout from "@/components/layout/MainLayout" // Layout principal
import Chart from "chart.js/auto"                    // Librería para gráficos interactivos
import "@/styles/logros.css"                        // Estilos específicos para esta página

/**
 * Componente para la página de logros/dashboard
 * Muestra métricas de rendimiento, gráficos y estadísticas del restaurante
 */
export default function LogrosPage() {
  // Efecto que se ejecuta al montar el componente para inicializar los gráficos
  useEffect(() => {
    /**
     * Función para inicializar todos los gráficos de la página
     * Crea instancias de Chart.js para diferentes visualizaciones
     */
    const initCharts = () => {
      // Gráfico de barras - Total de pedidos por tipo
      const ctxPedidos = document.getElementById('chartPedidos') as HTMLCanvasElement;
      if (ctxPedidos) {
        new Chart(ctxPedidos, {
          type: 'bar',
          data: {
            labels: ['Mesa', 'Recojo en tienda'],
            datasets: [{
              label: 'Total de pedidos',
              data: [1500, 2500],              // Datos de ejemplo - En producción vendrían de una API
              backgroundColor: ['rgba(255, 122, 0, 0.5)', 'rgba(255, 206, 86, 0.5)'],
              borderColor: ['rgba(255, 122, 0, 1)', 'rgba(255, 206, 86, 1)'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,                  // El gráfico se ajusta al tamaño del contenedor
            scales: {
              x: {
                beginAtZero: true              // El eje X comienza en cero
              },
              y: {
                beginAtZero: true              // El eje Y comienza en cero
              }
            }
          }
        });
      }

      // Gráfico circular - Propinas totales
      const ctxPropinas = document.getElementById('chartPropinas') as HTMLCanvasElement;
      if (ctxPropinas) {
        new Chart(ctxPropinas, {
          type: 'pie',
          data: {
            labels: ['Propinas Totales'],
            datasets: [{
              label: 'Propinas Totales',
              data: [500],                     // Datos de ejemplo - Total de propinas
              backgroundColor: ['rgba(255, 122, 0, 0.5)'],
              borderColor: ['rgba(255, 122, 0, 1)'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true                   // El gráfico se ajusta al tamaño del contenedor
          }
        });
      }
      
      // Gráfico lineal - Tendencia de ventas mensuales
      const ctxVentas = document.getElementById('chartVentas') as HTMLCanvasElement;
      if (ctxVentas) {
        new Chart(ctxVentas, {
          type: 'line',
          data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
              label: 'Ventas 2024',
              data: [30500, 28900, 32400, 35200, 38100, 40300, 42500, 45600, 43200, 41800, 0, 0], // Datos mensuales
              backgroundColor: 'rgba(255, 122, 0, 0.2)',
              borderColor: 'rgba(255, 122, 0, 1)',
              borderWidth: 2,
              tension: 0.3,                    // Curvatura de la línea
              fill: true                       // Rellenar el área bajo la línea
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true              // El eje Y comienza en cero
              }
            }
          }
        });
      }
    };

    // Pequeño timeout para asegurar que los elementos del DOM estén disponibles
    const timer = setTimeout(() => {
      initCharts();
    }, 100);

    // Función de limpieza al desmontar el componente para evitar memory leaks
    return () => {
      clearTimeout(timer);
      // Destruir las instancias de Chart si existen
      Chart.getChart('chartPedidos')?.destroy();
      Chart.getChart('chartPropinas')?.destroy();
      Chart.getChart('chartVentas')?.destroy();
    };
  }, []); // Array vacío significa que este efecto solo se ejecuta al montar y desmontar el componente

  return (
    <MainLayout>
      {/* Sección de bienvenida con título y mensaje personalizado */}
      <div className="logros-header">
        <h2>Mis Logros en FoodLy</h2>
        <p>Bienvenido, <strong>ADMIN</strong> - Panel de rendimiento y logros del restaurante</p>
      </div>
    
      {/* Sección de tarjetas de métricas clave */}
      <div className="row mb-4">
        {/* Tarjeta de total de pedidos */}
        <div className="col-md-4">
          <div className="achievement-card">
            <div className="achievement-icon">
              <i className="fas fa-utensils"></i>
            </div>
            <h5>Total de Pedidos</h5>
            <p>Total de pedidos completados en el último mes</p>
            <div className="achievement-value">4,000</div>
            {/* Barra de progreso visual */}
            <div className="achievement-progress">
              <div className="achievement-progress-bar" style={{ width: '80%' }}></div>
            </div>
            <p>+15.2% desde el mes anterior</p>
          </div>
        </div>
        
        {/* Tarjeta de ingresos totales */}
        <div className="col-md-4">
          <div className="achievement-card">
            <div className="achievement-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <h5>Ingresos Totales</h5>
            <p>Ingresos generados en el último mes</p>
            <div className="achievement-value">S/ 42,500</div>
            <div className="achievement-progress">
              <div className="achievement-progress-bar" style={{ width: '75%' }}></div>
            </div>
            <p>+8.5% desde el mes anterior</p>
          </div>
        </div>
        
        {/* Tarjeta de clientes nuevos */}
        <div className="col-md-4">
          <div className="achievement-card">
            <div className="achievement-icon">
              <i className="fas fa-users"></i>
            </div>
            <h5>Clientes Nuevos</h5>
            <p>Nuevos clientes registrados en el último mes</p>
            <div className="achievement-value">125</div>
            <div className="achievement-progress">
              <div className="achievement-progress-bar" style={{ width: '65%' }}></div>
            </div>
            <p>+12.3% desde el mes anterior</p>
          </div>
        </div>
      </div>
    
      {/* Sección de filtros para ajustar los datos mostrados */}
      <div className="filter-section mb-4">
        <h5><i className="fas fa-filter"></i> Filtrado</h5>
        <form>
          <div className="row mb-3">
            {/* Selector de rango de fechas */}
            <div className="col-md-4">
              <label htmlFor="rango-fecha" className="form-label">Rango de Fecha:</label>
              <input type="text" id="rango-fecha" className="form-control" defaultValue="17/abr/2025 - 17/may/2025" readOnly />
            </div>
            {/* Opciones de granularidad de datos */}
            <div className="col-md-8">
              <label htmlFor="filtrado-variable" className="form-label">Seleccionar variable de filtrado:</label>
              <div className="d-flex align-items-center">
                {/* Radio buttons para seleccionar el tipo de agrupación temporal */}
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
    
      {/* Sección de gráficos - Fila 1: Gráficos de pedidos y propinas */}
      <div className="row mb-4">
        {/* Gráfico de barras: Total de pedidos */}
        <div className="col-md-6 mb-4">
          <div className="chart-container">
            <h5 className="card-title"><i className="fas fa-chart-bar"></i> Reporte de Total de Pedidos</h5>
            <canvas id="chartPedidos"></canvas>
          </div>
        </div>
    
        {/* Gráfico circular: Propinas totales */}
        <div className="col-md-6 mb-4">
          <div className="chart-container">
            <h5 className="card-title"><i className="fas fa-chart-pie"></i> Reporte de Propinas Totales</h5>
            <canvas id="chartPropinas"></canvas>
          </div>
        </div>
      </div>
      
      {/* Sección de gráficos - Fila 2: Gráfico de tendencia */}
      <div className="row">
        <div className="col-12">
          <div className="chart-container">
            <h5 className="card-title"><i className="fas fa-chart-line"></i> Tendencia de Ventas Mensuales</h5>
            <canvas id="chartVentas"></canvas>
          </div>
        </div>
      </div>
      
      {/* Sección de seguimiento de metas */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="filter-section">
            <h5><i className="fas fa-trophy"></i> Metas del Mes</h5>
            <div className="row">
              {/* Barra de progreso: Meta de ventas */}
              <div className="col-md-4 mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Meta de ventas</span>
                  <span>85%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar" role="progressbar" style={{ width: '85%', backgroundColor: 'var(--primary)' }} aria-valuenow={85} aria-valuemin={0} aria-valuemax={100}></div>
                </div>
              </div>
              {/* Barra de progreso: Meta de clientes nuevos */}
              <div className="col-md-4 mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Meta de clientes nuevos</span>
                  <span>65%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar" role="progressbar" style={{ width: '65%', backgroundColor: 'var(--primary)' }} aria-valuenow={65} aria-valuemin={0} aria-valuemax={100}></div>
                </div>
              </div>
              {/* Barra de progreso: Meta de satisfacción */}
              <div className="col-md-4 mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Meta de satisfacción</span>
                  <span>92%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar" role="progressbar" style={{ width: '92%', backgroundColor: 'var(--primary)' }} aria-valuenow={92} aria-valuemin={0} aria-valuemax={100}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}