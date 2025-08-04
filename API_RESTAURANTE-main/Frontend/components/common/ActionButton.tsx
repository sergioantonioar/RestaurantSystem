"use client"

import type { ReactNode } from "react"

interface ActionButtonProps {
  icon: string
  variant?: string
  size?: "sm" | "md" | "lg"
  children: ReactNode
  onClick?: () => void
}

export default function ActionButton({ icon, variant = "primary", size = "md", children, onClick }: ActionButtonProps) {
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : ""

  return (
    <button className={`btn btn-${variant} ${sizeClass}`} onClick={onClick}>
      <i className={icon}></i> {children}
    </button>
  )
}
