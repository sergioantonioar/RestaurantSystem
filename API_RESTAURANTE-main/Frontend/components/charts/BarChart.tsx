"use client"

import { useEffect, useRef } from "react"

interface BarChartProps {
  id: string
  title: string
  labels: string[]
  data: number[]
}

export default function BarChart({ id, title, labels, data }: BarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Placeholder para inicialización de Chart.js
    console.log("Chart would be initialized here with:", { id, labels, data })
  }, [id, labels, data])

  return (
    <div className="chart-container">
      <h5 className="card-title">
        <i className="fas fa-chart-bar"></i> {title}
      </h5>
      <canvas id={id} ref={chartRef}></canvas>
    </div>
  )
}
