"use client"

import { useState } from "react"
import ModalPortal from "../common/ModalPortal"

interface CreateCajaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (nombreCaja: string) => void
  isLoading?: boolean
  cajasExistentes: { id_box: string; name_box: string }[]
}

export default function CreateCajaModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  cajasExistentes = []
}: CreateCajaModalProps) {
  const [nombreCaja, setNombreCaja] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sugerencias, setSugerencias] = useState<string[]>([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)

  // Función para calcular la distancia de Levenshtein (similitud entre strings)
  const calcularDistanciaLevenshtein = (a: string, b: string): number => {
    if (a.length === 0) return b.length
    if (b.length === 0) return a.length

    const matrix = []

    // Incrementar a lo largo de la primera columna de cada fila
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i]
    }

    // Incrementar a lo largo de la primera fila de cada columna
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j
    }

    // Rellenar el resto de la matriz
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // sustitución
            Math.min(
              matrix[i][j - 1] + 1,   // inserción
              matrix[i - 1][j] + 1    // eliminación
            )
          )
        }
      }
    }

    return matrix[b.length][a.length]
  }

  // Función para generar sugerencias basadas en el nombre ingresado
  const generarSugerencias = (nombre: string) => {
    const sugerenciasGeneradas: string[] = []
    
    // Nombre con número
    for (let i = 1; i <= 3; i++) {
      sugerenciasGeneradas.push(`${nombre} ${i}`)
    }
    
    // Nombres con prefijos o sufijos comunes
    const prefijos = ['Nueva', 'Principal', 'Auxiliar']
    for (const prefijo of prefijos) {
      if (!nombre.toLowerCase().includes(prefijo.toLowerCase())) {
        sugerenciasGeneradas.push(`${prefijo} ${nombre}`)
      }
    }
    
    // Verificar que las sugerencias no coincidan con cajas existentes
    const sugerenciasFiltradas = sugerenciasGeneradas.filter(sugerencia => 
      !cajasExistentes.some(caja => 
        caja.name_box.toLowerCase() === sugerencia.toLowerCase()
      )
    )
    
    setSugerencias(sugerenciasFiltradas.slice(0, 4)) // Limitar a 4 sugerencias
    setMostrarSugerencias(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const nombre = nombreCaja.trim()
    
    // Validación de campo vacío
    if (!nombre) {
      setError("El nombre de la caja es obligatorio")
      return
    }
    
    // Validación de longitud mínima
    if (nombre.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres")
      return
    }
    
    // Validación de nombres idénticos o muy similares
    const nombreNormalizado = nombre.toLowerCase()
    
    // Verificar coincidencia exacta
    const coincidenciaExacta = cajasExistentes.some(
      caja => caja.name_box.toLowerCase() === nombreNormalizado
    )
    
    if (coincidenciaExacta) {
      setError("Ya existe una caja con este nombre. Por favor, use un nombre diferente.")
      // Generar sugerencias
      generarSugerencias(nombre)
      return
    }
    
    // Verificar similitud por contención (si una caja contiene el nombre de otra)
    const coincidenciaParcial = cajasExistentes.find(
      caja => {
        const cajaName = caja.name_box.toLowerCase()
        return (
          (cajaName.includes(nombreNormalizado) && nombreNormalizado.length > 3) || 
          (nombreNormalizado.includes(cajaName) && cajaName.length > 3)
        )
      }
    )
    
    if (coincidenciaParcial) {
      setError(`El nombre es muy similar a "${coincidenciaParcial.name_box}". ¿Desea usar otro nombre?`)
      // Generar sugerencias
      generarSugerencias(nombre)
      return
    }
    
    // Verificar similitud por distancia de Levenshtein
    const cajasSimilesPorDistancia = cajasExistentes.filter(caja => {
      const distancia = calcularDistanciaLevenshtein(
        caja.name_box.toLowerCase(),
        nombreNormalizado
      )
      
      // Si el nombre es corto, ser más estrictos con la distancia permitida
      const umbralDistancia = Math.min(2, Math.floor(nombre.length / 3))
      
      return distancia <= umbralDistancia && distancia > 0
    })
    
    if (cajasSimilesPorDistancia.length > 0) {
      const cajaSimil = cajasSimilesPorDistancia[0]
      setError(`El nombre "${nombre}" se parece mucho a "${cajaSimil.name_box}". ¿Desea usar otro nombre?`)
      generarSugerencias(nombre)
      return
    }
    
    // Enviar nombre de caja
    onSubmit(nombre)
  }

  const handleCloseModal = () => {
    setNombreCaja("")
    setError(null)
    setSugerencias([])
    setMostrarSugerencias(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <ModalPortal>
      <div 
        className="modal fade show" 
        style={{ 
          display: 'block', 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1050
        }}
        onClick={handleCloseModal}
      >
        <div 
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content" style={{ borderRadius: '12px' }}>
            <div className="modal-header align-items-center" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <h5 className="modal-title fw-bold">
                <i className="fas fa-plus-circle text-success me-2"></i>
                Crear Nueva Caja
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleCloseModal}
                disabled={isLoading}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="cajaNombre" className="form-label fw-semibold">
                    Nombre de la Caja
                  </label>
                  <input
                    type="text"
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    id="cajaNombre"
                    placeholder="Ej: Caja Principal"
                    value={nombreCaja}
                    onChange={(e) => {
                      setNombreCaja(e.target.value)
                      if (error) {
                        setError(null)
                        setMostrarSugerencias(false)
                      }
                    }}
                    autoFocus
                    disabled={isLoading}
                  />
                  {error && (
                    <div className="invalid-feedback">
                      {error}
                    </div>
                  )}
                  {mostrarSugerencias && sugerencias.length > 0 && (
                    <div className="mt-3">
                      <label className="form-label text-info">
                        <i className="fas fa-lightbulb me-1"></i>
                        Sugerencias disponibles:
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {sugerencias.map((sugerencia, index) => (
                          <button
                            key={index}
                            type="button"
                            className="btn btn-outline-info btn-sm"
                            onClick={() => {
                              setNombreCaja(sugerencia)
                              setError(null)
                              setMostrarSugerencias(false)
                            }}
                          >
                            {sugerencia}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <small className="form-text text-muted">
                    Ingrese un nombre descriptivo para identificar esta caja.
                  </small>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={handleCloseModal}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-success d-flex align-items-center"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check me-2"></i>
                    Crear Caja
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}
