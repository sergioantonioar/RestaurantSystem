import type { ReactNode } from "react"

interface CardProps {
  title: string
  icon: string
  headerClass?: string
  children: ReactNode
}

export default function Card({ title, icon, headerClass = "bg-primary", children }: CardProps) {
  return (
    <div className="card mb-4">
      <div className={`card-header ${headerClass} text-white`}>
        <i className={icon}></i> {title}
      </div>
      <div className="card-body">{children}</div>
    </div>
  )
}
