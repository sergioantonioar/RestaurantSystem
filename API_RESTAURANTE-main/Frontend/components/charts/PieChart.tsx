"use client"

import { useEffect, useRef } from "react"

interface PieChartProps {
  id: string
  title: string
  labels: string[]
  data: number[]
}

export default function PieChart({ id, title, labels, data }: PieChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Placeholder para inicialización de Chart.js
    console.log("Pie chart would be initialized here with:", { id, labels, data })
  }, [id, labels, data])

  return (
    <div className="chart-container">
      <h5 className="card-title">
        <i className="fas fa-chart-pie"></i> {title}
      </h5>
      <canvas id={id} ref={chartRef}></canvas>
    </div>
  )
}
