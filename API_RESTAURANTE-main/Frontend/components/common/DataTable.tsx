import type { ReactNode } from "react"
import "@/styles/common.css"

interface DataTableProps {
  headers: string[]
  children: ReactNode
  className?: string
  title?: string
}

export default function DataTable({ headers, children, className = "", title }: DataTableProps) {
  return (
    <div className="foodly-card">
      {title && (
        <div className="foodly-card-header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="foodly-card-body">
        <div className="table-responsive">
          <table className={`table table-hover ${className}`}>
            <thead style={{ backgroundColor: 'var(--primary-light)' }}>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} scope="col" style={{ color: 'var(--text-dark)', fontWeight: '600' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
