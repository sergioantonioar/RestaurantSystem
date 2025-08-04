"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { apiClient } from "@/services/apiClient"

interface ATM {
  id_atm: string
  name_atm: string
}

interface Box {
  id_box: string
  name_box: string
  is_open: boolean
}

interface Props {
  onFilterChange: (atmId: string | null, boxName: string | null) => void
}

export default function ArqueoFilters({ onFilterChange }: Props) {
  const { user } = useAuth();
  const [atms, setAtms] = useState<ATM[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedAtm, setSelectedAtm] = useState<string | null>(null);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [pendingAtm, setPendingAtm] = useState<string | null>(null);
  const [pendingBox, setPendingBox] = useState<Box | null>(null);

  // Cargar ATMs si es admin
  useEffect(() => {
    if (user?.role === "ADMIN") {
      apiClient.get<{ status: number; message: string; data: ATM[] }>("atm/list?page=0").then(res => {
        setAtms(res.data);
      });
    } else if (user?.role === "ATM") {
      setSelectedAtm(user.id);
    }
  }, [user]);

  // Cargar cajas al seleccionar ATM
  useEffect(() => {
    if (selectedAtm) {
      apiClient.get<{ status: number; message: string; data: Box[] }>(`box/by-atm/${selectedAtm}`).then(res => {
        setBoxes(res.data);
      });
    } else {
      setBoxes([]);
    }
    setSelectedBox(null);
  }, [selectedAtm]);

  // Sincronizar valores iniciales
  useEffect(() => {
    setPendingAtm(selectedAtm);
    setPendingBox(selectedBox);
  }, [selectedAtm, selectedBox]);

  const handleApply = () => {
    onFilterChange(pendingAtm, pendingBox ? pendingBox.name_box : null);
  };

  // UI inspirada en pedidos: card blanca, header naranja, labels e inputs estilizados, foodly-btn, íconos y mejor espaciado
  return (
    <div className="foodly-card fade-in-up mb-4" style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)', borderRadius: 16, background: '#fff', padding: 0, overflow: 'hidden' }}>
      <div style={{ background: 'var(--primary)', borderRadius: '16px 16px 0 0', padding: '18px 36px 12px 36px', display: 'flex', alignItems: 'center', borderBottom: '2px solid var(--primary)', minHeight: 48 }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.15em', letterSpacing: 0.5, textAlign: 'center', width: '100%' }}>
          <i className="fas fa-filter me-2" style={{ fontSize: '1.1em', verticalAlign: 'middle' }}></i>
          Filtros de búsqueda
        </span>
      </div>
      <div className="foodly-card-body" style={{ padding: '28px 32px 18px 32px', background: '#fff' }}>
        <div className="row g-3 align-items-end">
          {/* ATM y Caja siempre ocupan 6 columnas cada uno para alineación perfecta */}
          <div className="col-md-6">
            {user?.role === "ADMIN" ? (
              <>
                <label className="foodly-form-label" style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  <i className="fas fa-building me-2" style={{ fontSize: '1.1em', verticalAlign: 'middle' }}></i>
                  ATM
                </label>
                <select
                  className="foodly-form-control"
                  style={{ borderRadius: 8, border: '1.5px solid var(--primary-light)', fontSize: '1.08em', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', background: '#fff', fontWeight: 500, color: '#333' }}
                  value={pendingAtm || ""}
                  onChange={e => {
                    const value = e.target.value || null;
                    setPendingAtm(value);
                    setSelectedAtm(value);
                    setPendingBox(null);
                  }}
                >
                  <option value="">Seleccione un ATM</option>
                  {atms.map(atm => (
                    <option key={atm.id_atm} value={atm.id_atm}>{atm.name_atm}</option>
                  ))}
                </select>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="col-md-6">
            <label className="foodly-form-label" style={{ fontWeight: 600, color: 'var(--primary)' }}>
              <i className="fas fa-cash-register me-2" style={{ fontSize: '1.1em', verticalAlign: 'middle' }}></i>
              Caja
            </label>
            <select
              className="foodly-form-control"
              style={{
                borderRadius: 8,
                border: '1.5px solid var(--primary-light)',
                fontSize: '1.08em',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                background: user?.role === "ADMIN" && !pendingAtm ? '#f1f1f1' : '#fff',
                color: user?.role === "ADMIN" && !pendingAtm ? '#b0b0b0' : '#333',
                fontWeight: 500,
                cursor: user?.role === "ADMIN" && !pendingAtm ? 'not-allowed' : 'pointer',
                opacity: user?.role === "ADMIN" && !pendingAtm ? 0.7 : 1
              }}
              value={pendingBox?.id_box || ""}
              onChange={e => {
                const box = boxes.find(b => b.id_box === e.target.value) || null;
                setPendingBox(box);
              }}
              disabled={user?.role === "ADMIN" ? !pendingAtm : false}
            >
              <option value="">Seleccione una caja</option>
              {boxes.map(box => (
                <option key={box.id_box} value={box.id_box}>
                  {box.name_box} {box.is_open ? "(Abierta)" : "(Cerrada)"}
                </option>
              ))}
            </select>
            {user?.role === "ADMIN" && !pendingAtm && (
              <div className="mt-1" style={{ color: '#b0b0b0', fontSize: 13 }}>
                <i className="fas fa-info-circle me-1"></i>Seleccione un ATM para habilitar las cajas
              </div>
            )}
          </div>
          <div className="col-12 d-flex justify-content-end mt-3">
            <button className="foodly-btn" style={{ minWidth: 160 }} onClick={handleApply}>
              <i className="fas fa-search me-2"></i>Aplicar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
