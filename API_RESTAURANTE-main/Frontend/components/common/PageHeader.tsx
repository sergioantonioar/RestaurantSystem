import "@/styles/common.css"

interface PageHeaderProps {
  title: string
  icon: string
  subtitle?: string
}

export default function PageHeader({ title, icon, subtitle }: PageHeaderProps) {
  return (
    <div className="page-header-container fade-in-up" style={{ marginBottom: '1.5rem' }}>
      <h2 className="page-header">
        <i className={`${icon} me-2`} style={{ color: 'var(--primary)' }}></i>
        {title}
      </h2>
      {subtitle && (
        <p className="page-subtitle" style={{ 
          color: 'var(--text-medium)', 
          marginTop: '0.5rem',
          fontSize: '1rem'
        }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
