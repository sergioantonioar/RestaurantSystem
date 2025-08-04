"use client";

import { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { boxService, BoxDTO } from "@/services/box-service";
import { useAuthData } from "@/hooks/useAuthData";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { atmService, ATMDTO } from "@/services/atm-service"; // Importar el servicio de ATM actualizado
import CreateCajaModal from "@/components/apertura-cierre/CreateCajaModal";
import CajaCard from "@/components/apertura-cierre/CajaCard"; // Importar el componente CajaCard
import ArqueoModal, { ArqueoInitDTO } from "@/components/apertura-cierre/ArqueoModal"; // Importar el modal de arqueo
import ConfirmationModal from "@/components/common/ConfirmationModal"; // Modal de confirmación
import NotificationModal from "@/components/common/NotificationModal"; // Modal de notificación

function AperturaCierreContent() {
  const [cajas, setCajas] = useState<BoxDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [atms, setAtms] = useState<ATMDTO[]>([]); // Estado para ATMs según filtro actual
  const [allAtms, setAllAtms] = useState<ATMDTO[]>([]); // Estado para todos los ATMs
  const [atmFilter, setAtmFilter] = useState<'all' | 'active' | 'inactive'>('active'); // Filtro de ATMs
  const [loadingAtms, setLoadingAtms] = useState(false); // Estado para carga de ATMs
  const [selectedCajaForATM, setSelectedCajaForATM] = useState<string | null>(null);
  const [showATMModal, setShowATMModal] = useState(false);
  const [isCreateCajaModalOpen, setIsCreateCajaModalOpen] = useState(false);
  const [isCreatingCaja, setIsCreatingCaja] = useState(false);
  const [showArqueoModal, setShowArqueoModal] = useState(false);
  const [selectedCajaForArqueo, setSelectedCajaForArqueo] = useState<string | null>(null);

  // Estados para modales de confirmación y notificación
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info' | 'success';
    confirmText?: string;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Funciones auxiliares para modales
  const showNotification = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    setNotificationModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: 'danger' | 'warning' | 'info' | 'success' = 'warning',
    confirmText: string = 'Confirmar'
  ) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      type,
      confirmText,
      isLoading: false,
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  };

  const closeNotificationModal = () => {
    setNotificationModal(prev => ({ ...prev, isOpen: false }));
  };

  const { user, getStoredUserId, isAuthenticated, isAdmin } = useAuthData();

  // Mapa global que almacena todas las cajas asignadas a ATMs
  // La clave es el ID de la caja y el valor es el ID del ATM asignado
  const [cajasAsignadas, setCajasAsignadas] = useState<Map<string, string>>(new Map());

  // Log para monitorear cambios en el mapa global
  useEffect(() => {
    console.log("🔄 Mapa global de cajas asignadas actualizado:");
    console.log("📊 Total de cajas asignadas:", cajasAsignadas.size);
    console.log("📊 Detalle:", Array.from(cajasAsignadas.entries()));
  }, [cajasAsignadas]);

  // Log para monitorear cambios en los estados de los modales
  useEffect(() => {
    console.log("🔄 Estados de modales:", {
      showATMModal,
      showArqueoModal,
      selectedCajaForATM,
      selectedCajaForArqueo
    });
  }, [showATMModal, showArqueoModal, selectedCajaForATM, selectedCajaForArqueo]);

  // Estado para controlar errores de conexión
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Función para mostrar error de conexión
  const showConnectionError = (message: string) => {
    setConnectionError(message);
    // Auto-ocultar después de 10 segundos
    setTimeout(() => setConnectionError(null), 10000);
  };

  // Función para verificar la conexión a internet
  const checkInternetConnection = () => {
    if (!navigator.onLine) {
      showConnectionError("No hay conexión a internet. Verifique su conectividad.");
      return false;
    }
    return true;
  };

  // Cargar la lista de cajas al inicializar el componente
  const loadCajas = async () => {
    try {
      setLoading(true);
      console.log("🔄 Iniciando carga de cajas...");

      // Verificar conexión a internet antes de la petición
      if (!navigator.onLine) {
        throw new Error("No hay conexión a internet. Verifique su conectividad.");
      }

      const response = await boxService.getBoxList();
      console.log("📦 Respuesta completa del servidor:", response);
      console.log("📦 Datos de cajas:", response.data);
      console.log("📦 Status de respuesta:", response.status);
      console.log("📦 Mensaje de respuesta:", response.message);

      // El boxService usa apiClient que devuelve SuccessMessage<BoxDTO[]>
      // Estructura: { status: number, message: string, data: BoxDTO[] }
      if (response && response.data && Array.isArray(response.data)) {
        console.log("🔄 Procesando datos de cajas del servidor y sincronizando con mapa global...");

        // Preservar el estado de carga (isLoading) durante actualizaciones para evitar parpadeos
        // y sincronizar con el mapa global de cajas asignadas
        const updatedCajas = response.data.map(newCaja => {
          const existingCaja = cajas.find(c => c.id_box === newCaja.id_box);
          const cajaId = newCaja.id_box;

          // Verificar si esta caja está en el mapa global de asignaciones
          const atmAsignado = cajasAsignadas.get(cajaId);

          // Si la caja ya tiene ATM en su propio objeto, usarlo
          // Si no, pero está en el mapa global, buscar el ATM correspondiente
          let atmInfo = newCaja.atm;

          if (!atmInfo && atmAsignado) {
            console.log(`🔄 Caja ${cajaId} tiene ATM ${atmAsignado} según el mapa global`);

            // Buscar el ATM en la lista de ATMs
            const atmEncontrado = allAtms.find(a => a.id_atm === atmAsignado);

            if (atmEncontrado) {
              console.log(`✅ ATM encontrado para caja ${cajaId}:`, atmEncontrado.name_atm);

              // Crear un objeto con la información necesaria del ATM
              atmInfo = {
                id_atm: atmEncontrado.id_atm,
                name_atm: atmEncontrado.name_atm,
                alias: atmEncontrado.alias,
                email: atmEncontrado.email,
                phone: atmEncontrado.phone,
                dni: atmEncontrado.dni
              };
            } else {
              console.log(`⚠️ ATM ${atmAsignado} no encontrado en la lista local`);

              // Aunque no tengamos los datos completos, creamos un objeto mínimo para indicar que está asignado
              atmInfo = {
                id_atm: atmAsignado
              };
            }
          }

          // Si la caja tiene un ATM según el servidor, pero no está en el mapa global,
          // actualizamos el mapa global (este caso es importante para la sincronización)
          if (newCaja.atm && !cajasAsignadas.has(cajaId)) {
            console.log(`🔄 Caja ${cajaId} tiene ATM ${newCaja.atm.id_atm} según el servidor, actualizando mapa global`);
            setCajasAsignadas(prevMapa => {
              const nuevoMapa = new Map(prevMapa);
              nuevoMapa.set(cajaId, newCaja.atm!.id_atm);
              return nuevoMapa;
            });
          }

          return {
            ...newCaja,
            isLoading: existingCaja?.isLoading || false,
            // Usar la información del ATM que determinamos arriba
            atm: atmInfo || existingCaja?.atm
          };
        });

        // Actualizar el estado de cajas con los datos sincronizados
        setCajas(updatedCajas);
        console.log("✅ Cajas establecidas en estado con sincronización de asignaciones:", updatedCajas);

        // Log adicional para verificar ATMs asignados
        updatedCajas.forEach((caja, index) => {
          console.log(`📦 Caja ${index + 1}:`, {
            id: caja.id_box,
            nombre: caja.name_box,
            abierta: caja.is_open,
            atm: caja.atm ? {
              id: caja.atm.id_atm,
              nombre: caja.atm.name_atm || 'Sin nombre',
              alias: caja.atm.alias || 'Sin alias'
            } : 'Sin ATM asignado'
          });
        });

        // Limpiar cualquier error de conexión previo
        setConnectionError(null);
      } else {
        console.warn("⚠️ response.data está vacío, es null, o no es un array");
        console.warn("⚠️ Estructura recibida:", response);

        // No borrar el estado de cajas actual si ya existía, para evitar parpadeos en caso de error
        if (cajas.length === 0) {
          setCajas([]);
        }

        showConnectionError("Error en el formato de respuesta del servidor al cargar cajas.");
      }

    } catch (error) {
      console.error("❌ Error al cargar las cajas:", error);

      // Mostrar mensaje de error en la UI
      let errorMessage = "Error al cargar las cajas.";
      if (error instanceof Error) {
        errorMessage += " " + error.message;
      }
      showConnectionError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cargar lista de ATMs activos disponibles para asignación
  const loadActiveATMs = async () => {
    try {
      setLoadingAtms(true);
      console.log("🏧 Cargando lista de ATMs activos...");

      // Obtener solo los ATMs activos - con un timeout máximo para no bloquear la UI
      const activeATMsPromise = atmService.getActiveATMs();

      // Usar Promise.race para limitar el tiempo de espera a 3 segundos
      const timeoutPromise = new Promise<ATMDTO[]>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout al cargar ATMs")), 3000);
      });

      const activeATMs = await Promise.race([activeATMsPromise, timeoutPromise])
        .catch(error => {
          console.warn("⚠️ Tiempo de espera excedido al cargar ATMs:", error);
          // Devolver un array vacío en caso de timeout para no bloquear la UI
          return [];
        });

      console.log("✅ ATMs activos obtenidos:", activeATMs.length);
      console.log("📋 Lista de ATMs activos:", activeATMs);

      setAtms(activeATMs);

    } catch (error) {
      console.error("❌ Error al cargar ATMs activos:", error);
      if (error instanceof Error) {
        console.error("❌ Mensaje de error:", error.message);
      }
      setAtms([]);
    } finally {
      setLoadingAtms(false);
    }
  };

  // Cargar cajas y ATMs cuando el componente se monta
  useEffect(() => {
    console.log("🎬 Componente AperturaCierreContent montado, cargando datos...");

    // Nueva función de inicialización optimizada
    const initData = async () => {
      try {
        setLoading(true);
        console.log("🔄 Iniciando carga sincronizada de datos...");

        // 1. Obtener todos los ATMs primero
        console.log("🏧 Paso 1: Cargando lista de ATMs");
        const atmsList = await loadAllATMs();
        if (!atmsList || atmsList.length === 0) {
          console.warn("⚠️ No se pudieron cargar los ATMs en la inicialización");
          showConnectionError("No se pudieron cargar los empleados. Intente recargar la página.");
        }

        // 2. Obtener todas las cajas asignadas a todos los ATMs
        console.log("🔍 Paso 2: Obteniendo todas las cajas asignadas a ATMs");
        const { boxMap } = await atmService.getAllBoxesAssignedToATMs();

        // 3. Actualizar el mapa global de cajas asignadas
        console.log("📝 Paso 3: Actualizando el mapa global con todas las asignaciones");
        console.log(`📊 Se encontraron ${boxMap.size} asignaciones de cajas a ATMs`);
        setCajasAsignadas(boxMap);

        // 4. Cargar todas las cajas y sincronizar su estado con las asignaciones
        console.log("📦 Paso 4: Cargando todas las cajas y sincronizando su estado");
        await loadCajas();

        // 5. Verificación final de consistencia
        console.log("✅ Paso 5: Verificación final de consistencia");
        setTimeout(() => {
          // Verificamos una última vez después de un breve tiempo para asegurar la consistencia
          actualizarMapaCajasAsignadas();

          // Log detallado del estado final
          console.log("📊 Estado final después de inicialización:");
          console.log("  - ATMs cargados:", allAtms.length);
          console.log("  - Cajas cargadas:", cajas.length);
          console.log("  - Cajas asignadas:", cajasAsignadas.size);
          console.log("  - Detalle de asignaciones:", Array.from(cajasAsignadas.entries()));
        }, 500); // Reducido de 1000ms a 500ms para mejor rendimiento

        console.log("✅ Inicialización de datos completada siguiendo el flujo recomendado");
      } catch (error) {
        console.error("❌ Error al inicializar datos:", error);
        showConnectionError("Error al cargar los datos iniciales. Por favor, actualice la página.");
      } finally {
        setLoading(false);
      }
    };

    // Iniciar la carga de datos
    initData();

    // Configurar intervalo para recargar datos periódicamente
    // Esto ayudará a mantener la UI sincronizada con el backend incluso si hay cambios
    // realizados por otros usuarios o en otras pestañas
    const intervalId = setInterval(() => {
      console.log("🔄 Recargando datos periódicamente...");
      initData();
    }, 5 * 60 * 1000); // Cada 5 minutos

    return () => {
      // Limpiar intervalo al desmontar el componente
      clearInterval(intervalId);
    };
  }, []);

  // Log para depurar cambios en el estado de cajas
  useEffect(() => {
    console.log("📊 Estado de cajas actualizado:", cajas);
    if (cajas.length > 0) {
      console.log("📊 Resumen de cajas:");
      cajas.forEach((caja, index) => {
        console.log(`  Caja ${index + 1}: ${caja.name_box} - ${caja.is_open ? 'Abierta' : 'Cerrada'} - ATM: ${caja.atm ? caja.atm.name_atm : 'Sin asignar'}`);
      });

      // Actualizar el mapa global de asignaciones cuando cambian las cajas
      // Pero solo usando los datos que ya tenemos, sin hacer llamadas API
      const nuevoMapa = new Map<string, string>(cajasAsignadas);

      // Primero, extraer todas las asignaciones que vienen en los datos de cajas
      cajas.forEach(caja => {
        if (caja.atm) {
          // Agregar o actualizar la asignación en el mapa
          nuevoMapa.set(caja.id_box, caja.atm.id_atm);
          console.log(`🔄 Actualizando mapa: Caja ${caja.id_box} asignada a ATM ${caja.atm.id_atm}`);
        }
      });

      // Actualizar el mapa global si hubo cambios
      if (nuevoMapa.size !== cajasAsignadas.size ||
        [...nuevoMapa.entries()].some(([k, v]) => cajasAsignadas.get(k) !== v)) {
        console.log("🔄 Actualizando mapa global desde datos de cajas");
        setCajasAsignadas(nuevoMapa);
      }
    }
  }, [cajas]);

  // Efecto adicional para garantizar la consistencia de datos
  useEffect(() => {
    // Si tenemos tanto cajas como ATMs cargados, verificar la sincronización
    if (cajas.length > 0 && allAtms.length > 0) {
      console.log("🔄 Verificando sincronización entre cajas y ATMs");

      // Verificar si hay cajas que tienen ATM en su propio objeto pero no en el mapa global
      const cajasConDiscrepancia = cajas.filter(caja =>
        caja.atm &&
        (!cajasAsignadas.has(caja.id_box) || cajasAsignadas.get(caja.id_box) !== caja.atm?.id_atm)
      );

      // Si hay discrepancias, actualizar el mapa global
      if (cajasConDiscrepancia.length > 0) {
        console.log(`⚠️ Se encontraron ${cajasConDiscrepancia.length} cajas con discrepancias entre el objeto y el mapa global`);
        console.log("🔄 Forzando actualización del mapa global para mantener consistencia");

        // Programar una actualización completa para evitar ciclos de renderizado
        const timeoutId = setTimeout(() => {
          actualizarMapaCajasAsignadas();
        }, 1000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [cajas, allAtms]);

  // Recargar cajas cuando la ventana vuelve a tener foco (usuario regresa de otra pestaña)
  // o de forma periódica para mantener los datos sincronizados
  useEffect(() => {
    // Reiniciar completamente los datos cuando la ventana recupera el foco
    const handleFocus = async () => {
      console.log("🔄 Ventana recuperó el foco, reiniciando datos completamente...");

      try {
        // Mostrar indicador de carga pero con un retraso para evitar parpadeos si es un cambio rápido
        const loadingTimeoutId = setTimeout(() => {
          setLoading(true);
        }, 300); // Solo mostrar loading si tarda más de 300ms

        // Cargar datos nuevamente siguiendo el flujo recomendado
        // 1. Obtener todos los ATMs primero
        console.log("🏧 Recargando lista de ATMs");
        const atmsList = await loadAllATMs();

        // 2. Obtener todas las cajas asignadas
        console.log("🔍 Obteniendo todas las cajas asignadas a ATMs");
        const { boxMap } = await atmService.getAllBoxesAssignedToATMs();

        // 3. Actualizar mapa global
        console.log("📝 Actualizando el mapa global");
        setCajasAsignadas(boxMap);

        // 4. Recargar cajas
        console.log("📦 Recargando todas las cajas");
        await loadCajas();

        // 5. Verificación final de consistencia
        console.log("✅ Verificación final de consistencia después de recuperar foco");
        setTimeout(() => {
          // Una última verificación para garantizar consistencia total
          actualizarMapaCajasAsignadas();
        }, 500);

        // Cancelar el timeout de carga si aún no se ha activado
        clearTimeout(loadingTimeoutId);

        console.log("✅ Datos reiniciados completamente después de recuperar el foco");
      } catch (error) {
        console.error("❌ Error al recargar datos:", error);
        showConnectionError("Error al actualizar los datos. Intente recargar la página.");
      } finally {
        setLoading(false);
      }
    };

    // Agregar listener para detectar cuando la ventana recupera el foco
    window.addEventListener('focus', handleFocus);

    // Remover listener cuando el componente se desmonte
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Log para depurar cambios en el estado de cajas
  useEffect(() => {
    console.log("📊 Estado de cajas actualizado:", cajas);
    if (cajas.length > 0) {
      console.log("📊 Resumen de cajas:");
      cajas.forEach((caja, index) => {
        console.log(`  Caja ${index + 1}: ${caja.name_box} - ${caja.is_open ? 'Abierta' : 'Cerrada'} - ATM: ${caja.atm ? caja.atm.name_atm : 'Sin asignar'}`);
      });

      // Actualizar el mapa global de asignaciones cuando cambian las cajas
      // Pero solo usando los datos que ya tenemos, sin hacer llamadas API
      const nuevoMapa = new Map<string, string>(cajasAsignadas);

      // Primero, extraer todas las asignaciones que vienen en los datos de cajas
      cajas.forEach(caja => {
        if (caja.atm) {
          // Agregar o actualizar la asignación en el mapa
          nuevoMapa.set(caja.id_box, caja.atm.id_atm);
          console.log(`🔄 Actualizando mapa: Caja ${caja.id_box} asignada a ATM ${caja.atm.id_atm}`);
        }
      });

      // Actualizar el mapa global si hubo cambios
      if (nuevoMapa.size !== cajasAsignadas.size ||
        [...nuevoMapa.entries()].some(([k, v]) => cajasAsignadas.get(k) !== v)) {
        console.log("🔄 Actualizando mapa global desde datos de cajas");
        setCajasAsignadas(nuevoMapa);
      }
    }
  }, [cajas]);

  // Efecto adicional para garantizar la consistencia de datos
  useEffect(() => {
    // Si tenemos tanto cajas como ATMs cargados, verificar la sincronización
    if (cajas.length > 0 && allAtms.length > 0) {
      console.log("🔄 Verificando sincronización entre cajas y ATMs");

      // Verificar si hay cajas que tienen ATM en su propio objeto pero no en el mapa global
      const cajasConDiscrepancia = cajas.filter(caja =>
        caja.atm &&
        (!cajasAsignadas.has(caja.id_box) || cajasAsignadas.get(caja.id_box) !== caja.atm?.id_atm)
      );

      // Si hay discrepancias, actualizar el mapa global
      if (cajasConDiscrepancia.length > 0) {
        console.log(`⚠️ Se encontraron ${cajasConDiscrepancia.length} cajas con discrepancias entre el objeto y el mapa global`);
        console.log("🔄 Forzando actualización del mapa global para mantener consistencia");

        // Programar una actualización completa para evitar ciclos de renderizado
        const timeoutId = setTimeout(() => {
          actualizarMapaCajasAsignadas();
        }, 1000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [cajas, allAtms]);

  // Recargar cajas cuando la ventana vuelve a tener foco (usuario regresa de otra pestaña)
  // o de forma periódica para mantener los datos sincronizados
  useEffect(() => {
    // Reiniciar completamente los datos cuando la ventana recupera el foco
    const handleFocus = async () => {
      console.log("🔄 Ventana recuperó el foco, reiniciando datos completamente...");

      try {
        // Mostrar indicador de carga pero con un retraso para evitar parpadeos si es un cambio rápido
        const loadingTimeoutId = setTimeout(() => {
          setLoading(true);
        }, 300); // Solo mostrar loading si tarda más de 300ms

        // Cargar datos nuevamente siguiendo el flujo recomendado
        // 1. Obtener todos los ATMs primero
        console.log("🏧 Recargando lista de ATMs");
        const atmsList = await loadAllATMs();

        // 2. Obtener todas las cajas asignadas
        console.log("🔍 Obteniendo todas las cajas asignadas a ATMs");
        const { boxMap } = await atmService.getAllBoxesAssignedToATMs();

        // 3. Actualizar mapa global
        console.log("📝 Actualizando el mapa global");
        setCajasAsignadas(boxMap);

        // 4. Recargar cajas
        console.log("📦 Recargando todas las cajas");
        await loadCajas();

        // 5. Verificación final de consistencia
        console.log("✅ Verificación final de consistencia después de recuperar foco");
        setTimeout(() => {
          // Una última verificación para garantizar consistencia total
          actualizarMapaCajasAsignadas();
        }, 500);

        // Cancelar el timeout de carga si aún no se ha activado
        clearTimeout(loadingTimeoutId);

        console.log("✅ Datos reiniciados completamente después de recuperar el foco");
      } catch (error) {
        console.error("❌ Error al recargar datos:", error);
        showConnectionError("Error al actualizar los datos. Intente recargar la página.");
      } finally {
        setLoading(false);
      }
    };

    // Agregar listener para detectar cuando la ventana recupera el foco
    window.addEventListener('focus', handleFocus);

    // Remover listener cuando el componente se desmonte
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Log para depurar cambios en el estado de cajas
  useEffect(() => {
    console.log("📊 Estado de cajas actualizado:", cajas);
    if (cajas.length > 0) {
      console.log("📊 Resumen de cajas:");
      cajas.forEach((caja, index) => {
        console.log(`  Caja ${index + 1}: ${caja.name_box} - ${caja.is_open ? 'Abierta' : 'Cerrada'} - ATM: ${caja.atm ? caja.atm.name_atm : 'Sin asignar'}`);
      });

      // Actualizar el mapa global de asignaciones cuando cambian las cajas
      // Pero solo usando los datos que ya tenemos, sin hacer llamadas API
      const nuevoMapa = new Map<string, string>(cajasAsignadas);

      // Primero, extraer todas las asignaciones que vienen en los datos de cajas
      cajas.forEach(caja => {
        if (caja.atm) {
          // Agregar o actualizar la asignación en el mapa
          nuevoMapa.set(caja.id_box, caja.atm.id_atm);
          console.log(`🔄 Actualizando mapa: Caja ${caja.id_box} asignada a ATM ${caja.atm.id_atm}`);
        }
      });

      // Actualizar el mapa global si hubo cambios
      if (nuevoMapa.size !== cajasAsignadas.size ||
        [...nuevoMapa.entries()].some(([k, v]) => cajasAsignadas.get(k) !== v)) {
        console.log("🔄 Actualizando mapa global desde datos de cajas");
        setCajasAsignadas(nuevoMapa);
      }
    }
  }, [cajas]);

  // Efecto adicional para garantizar la consistencia de datos
  useEffect(() => {
    // Si tenemos tanto cajas como ATMs cargados, verificar la sincronización
    if (cajas.length > 0 && allAtms.length > 0) {
      console.log("🔄 Verificando sincronización entre cajas y ATMs");

      // Verificar si hay cajas que tienen ATM en su propio objeto pero no en el mapa global
      const cajasConDiscrepancia = cajas.filter(caja =>
        caja.atm &&
        (!cajasAsignadas.has(caja.id_box) || cajasAsignadas.get(caja.id_box) !== caja.atm?.id_atm)
      );

      // Si hay discrepancias, actualizar el mapa global
      if (cajasConDiscrepancia.length > 0) {
        console.log(`⚠️ Se encontraron ${cajasConDiscrepancia.length} cajas con discrepancias entre el objeto y el mapa global`);
        console.log("🔄 Forzando actualización del mapa global para mantener consistencia");

        // Programar una actualización completa para evitar ciclos de renderizado
        const timeoutId = setTimeout(() => {
          actualizarMapaCajasAsignadas();
        }, 1000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [cajas, allAtms]);

  // Recargar cajas cuando la ventana vuelve a tener foco (usuario regresa de otra pestaña)
  // o de forma periódica para mantener los datos sincronizados
  useEffect(() => {
    // Reiniciar completamente los datos cuando la ventana recupera el foco
    const handleFocus = async () => {
      console.log("🔄 Ventana recuperó el foco, reiniciando datos completamente...");

      try {
        // Mostrar indicador de carga pero con un retraso para evitar parpadeos si es un cambio rápido
        const loadingTimeoutId = setTimeout(() => {
          setLoading(true);
        }, 300); // Solo mostrar loading si tarda más de 300ms

        // Cargar datos nuevamente siguiendo el flujo recomendado
        // 1. Obtener todos los ATMs primero
        console.log("🏧 Recargando lista de ATMs");
        const atmsList = await loadAllATMs();

        // 2. Obtener todas las cajas asignadas
        console.log("🔍 Obteniendo todas las cajas asignadas a ATMs");
        const { boxMap } = await atmService.getAllBoxesAssignedToATMs();

        // 3. Actualizar mapa global
        console.log("📝 Actualizando el mapa global");
        setCajasAsignadas(boxMap);

        // 4. Recargar cajas
        console.log("📦 Recargando todas las cajas");
        await loadCajas();

        // 5. Verificación final de consistencia
        console.log("✅ Verificación final de consistencia después de recuperar foco");
        setTimeout(() => {
          // Una última verificación para garantizar consistencia total
          actualizarMapaCajasAsignadas();
        }, 500);

        // Cancelar el timeout de carga si aún no se ha activado
        clearTimeout(loadingTimeoutId);

        console.log("✅ Datos reiniciados completamente después de recuperar el foco");
      } catch (error) {
        console.error("❌ Error al recargar datos:", error);
        showConnectionError("Error al actualizar los datos. Intente recargar la página.");
      } finally {
        setLoading(false);
      }
    };

    // Agregar listener para detectar cuando la ventana recupera el foco
    window.addEventListener('focus', handleFocus);

    // Remover listener cuando el componente se desmonte
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Log para depurar cambios en el estado de cajas
  useEffect(() => {
    console.log("📊 Estado de cajas actualizado:", cajas);
    if (cajas.length > 0) {
      console.log("📊 Resumen de cajas:");
      cajas.forEach((caja, index) => {
        console.log(`  Caja ${index + 1}: ${caja.name_box} - ${caja.is_open ? 'Abierta' : 'Cerrada'} - ATM: ${caja.atm ? caja.atm.name_atm : 'Sin asignar'}`);
      });

      // Actualizar el mapa global de asignaciones cuando cambian las cajas
      // Pero solo usando los datos que ya tenemos, sin hacer llamadas API
      const nuevoMapa = new Map<string, string>(cajasAsignadas);

      // Primero, extraer todas las asignaciones que vienen en los datos de cajas
      cajas.forEach(caja => {
        if (caja.atm) {
          // Agregar o actualizar la asignación en el mapa
          nuevoMapa.set(caja.id_box, caja.atm.id_atm);
          console.log(`🔄 Actualizando mapa: Caja ${caja.id_box} asignada a ATM ${caja.atm.id_atm}`);
        }
      });

      // Actualizar el mapa global si hubo cambios
      if (nuevoMapa.size !== cajasAsignadas.size ||
        [...nuevoMapa.entries()].some(([k, v]) => cajasAsignadas.get(k) !== v)) {
        console.log("🔄 Actualizando mapa global desde datos de cajas");
        setCajasAsignadas(nuevoMapa);
      }
    }
  }, [cajas]);

  // Efecto adicional para garantizar la consistencia de datos
  useEffect(() => {
    // Si tenemos tanto cajas como ATMs cargados, verificar la sincronización
    if (cajas.length > 0 && allAtms.length > 0) {
      console.log("🔄 Verificando sincronización entre cajas y ATMs");

      // Verificar si hay cajas que tienen ATM en su propio objeto pero no en el mapa global
      const cajasConDiscrepancia = cajas.filter(caja =>
        caja.atm &&
        (!cajasAsignadas.has(caja.id_box) || cajasAsignadas.get(caja.id_box) !== caja.atm?.id_atm)
      );

      // Si hay discrepancias, actualizar el mapa global
      if (cajasConDiscrepancia.length > 0) {
        console.log(`⚠️ Se encontraron ${cajasConDiscrepancia.length} cajas con discrepancias entre el objeto y el mapa global`);
        console.log("🔄 Forzando actualización del mapa global para mantener consistencia");

        // Programar una actualización completa para evitar ciclos de renderizado
        const timeoutId = setTimeout(() => {
          actualizarMapaCajasAsignadas();
        }, 1000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [cajas, allAtms]);

  // Recargar cajas cuando la ventana vuelve a tener foco (usuario regresa de otra pestaña)
  // o de forma periódica para mantener los datos sincronizados
  useEffect(() => {
    // Reiniciar completamente los datos cuando la ventana recupera el foco
    const handleFocus = async () => {
      console.log("🔄 Ventana recuperó el foco, reiniciando datos completamente...");

      try {
        // Mostrar indicador de carga pero con un retraso para evitar parpadeos si es un cambio rápido
        const loadingTimeoutId = setTimeout(() => {
          setLoading(true);
        }, 300); // Solo mostrar loading si tarda más de 300ms

        // Cargar datos nuevamente siguiendo el flujo recomendado
        // 1. Obtener todos los ATMs primero
        console.log("🏧 Recargando lista de ATMs");
        const atmsList = await loadAllATMs();

        // 2. Obtener todas las cajas asignadas
        console.log("🔍 Obteniendo todas las cajas asignadas a ATMs");
        const { boxMap } = await atmService.getAllBoxesAssignedToATMs();

        // 3. Actualizar mapa global
        console.log("📝 Actualizando el mapa global");
        setCajasAsignadas(boxMap);

        // 4. Recargar cajas
        console.log("📦 Recargando todas las cajas");
        await loadCajas();

        // 5. Verificación final de consistencia
        console.log("✅ Verificación final de consistencia después de recuperar foco");
        setTimeout(() => {
          // Una última verificación para garantizar consistencia total
          actualizarMapaCajasAsignadas();
        }, 500);

        // Cancelar el timeout de carga si aún no se ha activado
        clearTimeout(loadingTimeoutId);

        console.log("✅ Datos reiniciados completamente después de recuperar el foco");
      } catch (error) {
        console.error("❌ Error al recargar datos:", error);
        showConnectionError("Error al actualizar los datos. Intente recargar la página.");
      } finally {
        setLoading(false);
      }
    };

    // Agregar listener para detectar cuando la ventana recupera el foco
    window.addEventListener('focus', handleFocus);

    // Remover listener cuando el componente se desmonte
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleCreateCaja = async (nombreCaja: string) => {
    try {
      // Obtener el ID del usuario/admin
      const adminId = user?.id || getStoredUserId();

      if (!adminId) {
        console.error("❌ No se pudo obtener el ID del administrador");
        showConnectionError("Error: No se pudo identificar al usuario administrador");
        return;
      }

      setIsCreatingCaja(true);
      console.log("🏗️ Creando caja:", { nombreCaja, adminId });

      // Llamar al servicio para crear la caja
      const response = await boxService.createBox(adminId, { name_box: nombreCaja });
      console.log("✅ Caja creada exitosamente:", response);

      // Recargar la lista de cajas desde el backend
      await loadCajas();

      // Cerrar el modal
      setIsCreateCajaModalOpen(false);

    } catch (error) {
      console.error("❌ Error al crear la caja:", error);
      showConnectionError("Error al crear la caja. Por favor, inténtelo de nuevo.");
    } finally {
      setIsCreatingCaja(false);
    }
  };
  // Función para abrir modal de asignar ATM
  const handleActivarCaja = async (cajaId: string) => {
    console.log("🔧 Verificando estado de la caja antes de abrir modal:", cajaId);

    // Verificar si el usuario está autenticado
    if (!isAuthenticated()) {
      showNotification(
        "Sesión requerida",
        "Debes iniciar sesión para asignar empleados a las cajas. Por favor, inicia sesión primero.",
        "warning"
      );
      return;
    }

    // Verificar conexión a internet
    if (!checkInternetConnection()) {
      return;
    }

    // VERIFICACIÓN CRÍTICA: Forzar una actualización del mapa global antes de continuar
    console.log("🔄 Actualizando estado de asignaciones antes de continuar...");
    await actualizarMapaCajasAsignadas();

    // Ahora verificar si la caja ya tiene un ATM asignado según el mapa global actualizado
    if (cajasAsignadas.has(cajaId)) {
      const atmAsignado = cajasAsignadas.get(cajaId);
      console.log(`⚠️ La caja ${cajaId} ya tiene asignado el ATM ${atmAsignado} según el mapa global`);

      // Buscar información del ATM para mostrarla en la alerta
      const atmInfo = allAtms.find(atm => atm.id_atm === atmAsignado);
      const atmNombre = atmInfo ? atmInfo.name_atm : `ATM ${atmAsignado}`;

      // Mostrar alerta y no abrir el modal
      showNotification(
        "Empleado ya asignado",
        `Esta caja ya tiene asignado el empleado: ${atmNombre}\n\nSi desea cambiar la asignación, primero debe desasignar este empleado.`,
        "warning"
      );

      // Forzar una actualización de la UI para reflejar el estado correcto
      await loadCajas();

      return;
    }

    // También verificar en el objeto local de la caja
    const cajaSeleccionada = cajas.find(c => c.id_box === cajaId);
    if (cajaSeleccionada?.atm) {
      console.log(`⚠️ La caja ${cajaId} ya tiene asignado el ATM ${cajaSeleccionada.atm.id_atm} según el objeto local`);

      // Mostrar alerta y no abrir el modal
      showNotification(
        "Empleado ya asignado",
        `Esta caja ya tiene asignado el empleado: ${cajaSeleccionada.atm.name_atm || cajaSeleccionada.atm.id_atm}\n\nSi desea cambiar la asignación, primero debe desasignar este empleado.`,
        "warning"
      );

      // Actualizar el mapa global si no estaba registrado
      if (!cajasAsignadas.has(cajaId)) {
        console.log("🔄 Actualizando mapa global con la asignación encontrada en el objeto local");
        setCajasAsignadas(prev => {
          const nuevoMapa = new Map(prev);
          nuevoMapa.set(cajaId, cajaSeleccionada.atm!.id_atm);
          return nuevoMapa;
        });

        // Forzar actualización de la UI
        await loadCajas();
      }

      return;
    }

    // Si llegamos aquí, la caja no está asignada, proceder con normalidad
    console.log("🔐 Usuario autenticado y caja disponible, procediendo a cargar ATMs...");
    setSelectedCajaForATM(cajaId);

    try {
      // Establecer filtro por defecto en activos
      setAtmFilter('active');

      // Cargar ATMs activos para mostrar en el modal
      await loadActiveATMs();

      // Marcar la caja como "cargando" mientras se muestra el modal
      setCajas(prevCajas =>
        prevCajas.map(caja =>
          caja.id_box === cajaId
            ? { ...caja, isLoading: false } // No mostrar "Procesando..." para mejor experiencia visual
            : caja
        )
      );

      console.log("✅ Abriendo modal para asignar ATM a caja");
      setShowATMModal(true);
    } catch (error) {
      console.error("❌ Error al preparar el modal de ATMs:", error);
      setCajas(prevCajas =>
        prevCajas.map(caja =>
          caja.id_box === cajaId
            ? { ...caja, isLoading: false }
            : caja
        )
      );
      showConnectionError("Error al cargar los empleados disponibles. Intente nuevamente.");
    }
  };  // Función para asignar empleado (ATM) a una caja
  const handleAsignarATM = async (atmId: string) => {
    if (!selectedCajaForATM) {
      console.error("❌ No hay caja seleccionada");
      showNotification("Error", "No hay caja seleccionada", "error");
      return;
    }

    // Encontrar el ATM seleccionado en la lista completa
    const selectedATM = allAtms.find(atm => atm.id_atm === atmId);

    if (!selectedATM) {
      console.error("❌ No se encontró el ATM en la lista local");
      showNotification("Error", "No se encontró el empleado seleccionado", "error");
      return;
    }

    // Verificar si el ATM está activo
    if (!selectedATM.is_active) {
      console.error("❌ Intento de asignar un ATM inactivo");
      showNotification(
        "Empleado inactivo",
        "No se pueden asignar empleados inactivos. Solo los empleados activos pueden ser asignados a cajas.",
        "error"
      );
      return;
    }

    console.log("🔗 Iniciando asignación de empleado a caja...");
    console.log("🔗 Caja seleccionada:", selectedCajaForATM);
    console.log("🔗 Empleado seleccionado:", atmId);

    // 1. OPTIMIZACIÓN VISUAL: Cerrar el modal inmediatamente para mejor experiencia
    setShowATMModal(false);

    // 2. OPTIMIZACIÓN UI: Actualizar la UI instantáneamente sin esperar al servidor
    // Esto da sensación de respuesta inmediata al usuario
    setCajas(prevCajas => prevCajas.map(caja =>
      caja.id_box === selectedCajaForATM ? {
        ...caja,
        atm: {
          id_atm: selectedATM.id_atm,
          name_atm: selectedATM.name_atm,
          alias: selectedATM.alias,
          email: selectedATM.email,
          phone: selectedATM.phone || "",
          dni: selectedATM.dni || ""
        },
        isLoading: false // Ya no mostramos loading para una experiencia más fluida
      } : caja
    ));

    // 3. OPTIMIZACIÓN ESTADO GLOBAL: Actualizar el mapa global instantáneamente
    setCajasAsignadas(prevMapa => {
      const nuevoMapa = new Map(prevMapa);
      nuevoMapa.set(selectedCajaForATM, atmId);
      return nuevoMapa;
    });

    // 4. FEEDBACK INSTANTÁNEO: Mostrar notificación de éxito inmediatamente
    // Esto da sensación de que la operación ya se completó
    showNotification(
      "Éxito",
      `Empleado ${selectedATM.name_atm} asignado exitosamente a la caja`,
      "success"
    );

    // 5. LIMPIEZA: Limpiar estado del modal
    setSelectedCajaForATM(null);

    // 6. BACKEND ASYNC: Realizar la llamada al servidor en segundo plano
    // Esta llamada ya no bloquea la UI ni afecta la experiencia
    try {
      console.log("📡 Llamando al servicio assignATMToBox en segundo plano...");
      const response = await boxService.assignATMToBox(selectedCajaForATM, atmId);
      console.log("✅ Respuesta de asignación recibida:", response);

      // 7. RECARGA DISCRETA: Recargar datos solo después de completar la operación
      // Y hacerlo con un pequeño retraso para que no sea perceptible
      setTimeout(() => {
        console.log("🔄 Recargando datos después de asignación exitosa");
        loadCajas().catch(err =>
          console.warn("⚠️ Error menor al recargar datos en segundo plano:", err)
        );
      }, 500);
    } catch (error) {
      console.error("❌ Error al asignar empleado:", error);

      // 8. RESTAURACIÓN EN CASO DE ERROR: Solo si hay error, revertimos los cambios
      // Así no interrumpimos la experiencia positiva en caso normal
      setCajas(prevCajas => prevCajas.map(caja =>
        caja.id_box === selectedCajaForATM ? {
          ...caja,
          atm: undefined, // Revertir la asignación
          isLoading: false
        } : caja
      ));

      // Revertir cambios en el mapa global
      setCajasAsignadas(prevMapa => {
        const nuevoMapa = new Map(prevMapa);
        nuevoMapa.delete(selectedCajaForATM);
        return nuevoMapa;
      });

      // Mostrar notificación de error solo si la operación realmente falló
      showNotification(
        "Error",
        "Error al asignar empleado. Por favor, inténtelo de nuevo.",
        "error"
      );

      // Manejo específico para errores de autenticación
      if (error && typeof error === 'object') {
        // Detectar errores de autenticación (401/403)
        const isAuthError =
          ('status' in error && ((error as any).status === 401 || (error as any).status === 403)) ||
          ('response' in error && ((error as any).response?.status === 401 || (error as any).response?.status === 403));

        if (isAuthError) {
          console.warn("⚠️ Error de autenticación al asignar empleado");
          showNotification(
            "Sesión expirada",
            "Su sesión ha expirado. Por favor, inicie sesión nuevamente para continuar.",
            "warning"
          );
        }
      }
    }
  };
  // Función para cambiar estado de caja
  const handleToggleCaja = async (cajaId: string) => {
    try {
      console.log("🔄 Cambiando estado de caja:", cajaId);

      // Encontrar la caja actual
      const caja = cajas.find(c => c.id_box === cajaId);
      if (!caja) {
        console.error("❌ Caja no encontrada");
        return;
      }

      console.log("📊 Información de la caja:", {
        id: caja.id_box,
        nombre: caja.name_box,
        abierta: caja.is_open,
        atm: caja.atm,
        mapaGlobal: cajasAsignadas.get(cajaId)
      });

      // Verificar si la caja está cerrada y se quiere abrir (requiere arqueo)
      if (!caja.is_open) {
        console.log("🔐 La caja está cerrada, requiere arqueo inicial para abrirse");

        // Verificar que la caja tenga un ATM asignado usando múltiples métodos de verificación
        const tieneATMEnObjeto = !!(caja.atm && caja.atm.id_atm);
        const tieneATMEnMapa = cajasAsignadas.has(cajaId);
        const tieneATMAsignado = tieneATMEnObjeto || tieneATMEnMapa;

        console.log("🔍 Verificando ATM asignado:", {
          cajaId,
          cajaAtm: caja.atm,
          tieneATMEnObjeto,
          tieneATMEnMapa,
          atmEnMapa: cajasAsignadas.get(cajaId),
          mapaCompleto: Array.from(cajasAsignadas.entries()),
          resultado: tieneATMAsignado
        });

        if (!tieneATMAsignado) {
          console.warn("⚠️ No se encontró ATM asignado, mostrando alerta");
          showNotification(
            "Empleado requerido",
            "Para abrir una caja, primero debe asignar un empleado.",
            "warning"
          );
          return;
        }

        // Abrir modal de arqueo inicial
        console.log("✅ ATM verificado, abriendo modal de arqueo");
        setSelectedCajaForArqueo(cajaId);
        setShowArqueoModal(true);
        return;
      }

      // Si la caja está abierta, se puede cerrar directamente
      console.log("🔄 Cerrando caja sin necesidad de arqueo");
      await cerrarCaja(cajaId);

    } catch (error) {
      console.error("❌ Error al cambiar estado de caja:", error);
      showNotification(
        "Error",
        "Error al cambiar el estado de la caja",
        "error"
      );
    }
  };

  // Función para abrir caja con arqueo inicial
  const abrirCajaConArqueo = async (cajaId: string, arqueoData: any) => {
    try {
      console.log("� Abriendo caja con arqueo inicial:", { cajaId, arqueoData });

      // Mostrar loading mientras se procesa la solicitud
      setCajas(prevCajas =>
        prevCajas.map(c =>
          c.id_box === cajaId
            ? { ...c, isLoading: true }
            : c
        )
      );

      // Llamar al backend para abrir la caja con arqueo
      const response = await boxService.openBox(cajaId, arqueoData);
      console.log("✅ Respuesta del servidor al abrir caja:", response);

      // Actualizar la lista de cajas desde el servidor para tener datos actualizados
      await loadCajas();

      // Cerrar el modal de arqueo
      setShowArqueoModal(false);
      setSelectedCajaForArqueo(null);

      console.log("✅ Caja abierta correctamente con arqueo inicial");
      showNotification(
        "Éxito",
        "Caja abierta exitosamente",
        "success"
      );

    } catch (error) {
      // Log más inteligente para evitar confusión con tokens expirados
      if (error && typeof error === 'object' && 'status' in error && 'name' in error && (error as any).name === 'ApiError') {
        const apiError = error as any;
        if (apiError.status === 403 || apiError.status === 401) {
          console.warn("⚠️ Error al abrir caja con arqueo: Token expirado");
        } else {
          console.error("❌ Error al abrir caja con arqueo:", error);
        }
      } else {
        console.error("❌ Error al abrir caja con arqueo:", error);
      }

      // Manejo específico de errores
      let errorMessage = "Error al abrir la caja";

      // Verificar si es nuestro ApiError personalizado
      if (error && typeof error === 'object' && 'status' in error && 'name' in error && (error as any).name === 'ApiError') {
        const apiError = error as any; // Conversión más segura

        if (apiError.status === 403 || apiError.status === 401) {
          // Error 403/401: Token expirado o acceso no autorizado
          console.warn("⚠️ Token expirado o acceso no autorizado");
          showNotification(
            "Sesión expirada",
            "Su sesión ha expirado. Por favor, inicie sesión nuevamente para continuar.",
            "warning"
          );

          // Cerrar el modal y no restaurar estado ya que el usuario será redirigido al login
          setShowArqueoModal(false);
          setSelectedCajaForArqueo(null);
          return;
        }

        // Otros errores de API
        errorMessage = apiError.message || `Error ${apiError.status}`;
      }
      // Verificar si es un error HTTP con respuesta del servidor (fallback)
      else if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as { response: { status?: number; data?: any } };

        if (httpError.response?.status === 403) {
          console.warn("⚠️ Token expirado o acceso no autorizado");
          showNotification(
            "Sesión expirada",
            "Su sesión ha expirado. Por favor, inicie sesión nuevamente para continuar.",
            "warning"
          );

          setShowArqueoModal(false);
          setSelectedCajaForArqueo(null);
          return;
        }

        errorMessage += ` (${httpError.response?.status || 'Error HTTP'})`;
        if (httpError.response?.data?.message) {
          errorMessage += `: ${httpError.response.data.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      showNotification(
        "Error",
        errorMessage,
        "error"
      );

      // Restaurar estado anterior
      setCajas(prevCajas =>
        prevCajas.map(c =>
          c.id_box === cajaId
            ? { ...c, isLoading: false }
            : c
        )
      );
    }
  };

  // Función para cerrar caja
  const cerrarCaja = async (cajaId: string) => {
    try {
      console.log("🔒 Iniciando proceso de cierre de caja:", cajaId);

      // Encontrar la información de la caja
      const caja = cajas.find(c => c.id_box === cajaId);
      if (!caja) {
        console.error("❌ Caja no encontrada");
        showNotification(
          "Error",
          "No se encontró la caja seleccionada",
          "error"
        );
        return;
      }

      // Verificar que la caja esté abierta antes de intentar cerrarla
      if (!caja.is_open) {
        console.warn("⚠️ La caja ya está cerrada");
        showNotification(
          "Información",
          "Esta caja ya está cerrada.",
          "info"
        );
        return;
      }

      // Mostrar confirmación antes de cerrar
      showConfirmation(
        "Confirmar cierre de caja",
        `¿Estás seguro de que deseas cerrar la caja "${caja.name_box}"?\n\nEsta acción cerrará definitivamente la caja y no podrás realizar más operaciones hasta que la vuelvas a abrir.`,
        async () => {
          console.log("✅ Usuario confirmó el cierre de caja, procediendo...");
          await realizarCierreCaja(cajaId, caja);
        },
        "danger",
        "Cerrar Caja"
      );

    } catch (error) {
      console.error("❌ Error al iniciar proceso de cierre:", error);
      showNotification(
        "Error",
        "Error al iniciar el proceso de cierre de caja",
        "error"
      );
    }
  };

  // Función auxiliar para realizar el cierre de caja
  const realizarCierreCaja = async (cajaId: string, caja: BoxDTO) => {
    try {
      setCajas(prevCajas =>
        prevCajas.map(c =>
          c.id_box === cajaId
            ? { ...c, isLoading: true }
            : c
        )
      );

      // Llamar al backend para cerrar la caja
      const response = await boxService.closeBox(cajaId);
      console.log("✅ Respuesta del servidor al cerrar caja:", response);

      // Verificar el status de la respuesta
      if (response && (response.status === 200 || response.status === 201)) {
        console.log("✅ Caja cerrada exitosamente por el servidor");

        // Actualizar inmediatamente el estado local
        setCajas(prevCajas =>
          prevCajas.map(c =>
            c.id_box === cajaId
              ? { ...c, is_open: false, isLoading: false }
              : c
          )
        );

        // Recargar la lista de cajas desde el servidor para asegurar consistencia
        setTimeout(async () => {
          await loadCajas();
        }, 500);

        console.log("✅ Caja cerrada correctamente");
        showNotification(
          "Éxito",
          `Caja "${caja.name_box}" cerrada exitosamente`,
          "success"
        );

      } else {
        console.error("❌ Respuesta inesperada del servidor:", response);
        throw new Error("La respuesta del servidor no indica éxito");
      }

    } catch (error) {
      // Log más inteligente para evitar confusión con tokens expirados
      if (error && typeof error === 'object' && 'status' in error && 'name' in error && (error as any).name === 'ApiError') {
        const apiError = error as any;
        if (apiError.status === 403 || apiError.status === 401) {
          console.warn("⚠️ Error al cerrar caja: Token expirado");
        } else {
          console.error("❌ Error al cerrar caja:", error);
        }
      } else {
        console.error("❌ Error al cerrar caja:", error);
      }

      // Manejo específico de errores
      let errorMessage = "Error al cerrar la caja";

      // Verificar si es nuestro ApiError personalizado
      if (error && typeof error === 'object' && 'status' in error && 'name' in error && (error as any).name === 'ApiError') {
        const apiError = error as any; // Conversión más segura

        if (apiError.status === 403 || apiError.status === 401) {
          // Error 403/401: Token expirado o acceso no autorizado
          console.warn("⚠️ Token expirado o acceso no autorizado");
          showNotification(
            "Sesión expirada",
            "Su sesión ha expirado. Por favor, inicie sesión nuevamente para continuar.",
            "warning"
          );

          // No restaurar estado anterior ya que el usuario será redirigido al login
          // El sistema manejará automáticamente el logout
          return;
        } else if (apiError.status === 400) {
          // Error 400: La caja ya está cerrada
          if (apiError.message && apiError.message.includes("caja ya esta cerrada")) {
            console.warn("⚠️ La caja ya estaba cerrada según el servidor");
            showNotification(
              "Información",
              "Esta caja ya está cerrada.",
              "info"
            );

            // Actualizar el estado local para reflejar que está cerrada
            setCajas(prevCajas =>
              prevCajas.map(c =>
                c.id_box === cajaId
                  ? { ...c, is_open: false, isLoading: false }
                  : c
              )
            );

            // Recargar datos para sincronizar
            setTimeout(async () => {
              await loadCajas();
            }, 500);

            return;
          }
        }

        // Otros errores de API
        errorMessage = apiError.message || `Error ${apiError.status}`;
      }
      // Verificar si es un error HTTP con respuesta del servidor (fallback para otros tipos de error)
      else if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as { response: { status?: number; data?: any } };

        if (httpError.response?.status === 403) {
          console.warn("⚠️ Token expirado o acceso no autorizado");
          showNotification(
            "Sesión expirada",
            "Su sesión ha expirado. Por favor, inicie sesión nuevamente para continuar.",
            "warning"
          );
          return;
        } else if (httpError.response?.status === 400) {
          if (httpError.response.data?.message === "La caja ya esta cerrada") {
            console.warn("⚠️ La caja ya estaba cerrada según el servidor");
            showNotification(
              "Información",
              "Esta caja ya está cerrada.",
              "info"
            );

            setCajas(prevCajas =>
              prevCajas.map(c =>
                c.id_box === cajaId
                  ? { ...c, is_open: false, isLoading: false }
                  : c
              )
            );

            setTimeout(async () => {
              await loadCajas();
            }, 500);

            return;
          }
        }

        errorMessage += ` (${httpError.response?.status || 'Error HTTP'})`;
        if (httpError.response?.data?.message) {
          errorMessage += `: ${httpError.response.data.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      showNotification(
        "Error",
        errorMessage,
        "error"
      );

      // Restaurar estado anterior
      setCajas(prevCajas =>
        prevCajas.map(c =>
          c.id_box === cajaId
            ? { ...c, isLoading: false }
            : c
        )
      );
    }
  };  // Cargar lista de todos los ATMs y aplicar filtro
  const loadAllATMs = async () => {
    try {
      setLoadingAtms(true);
      console.log("🏧 Cargando lista completa de ATMs...");

      // Verificar conexión a internet antes de la petición
      if (!navigator.onLine) {
        throw new Error("No hay conexión a internet. Por favor, verifique su conectividad y vuelva a intentarlo.");
      }

      // Llamada directa al servicio sin usar Promise.race
      // El manejo de timeout ya está en el apiClient
      console.log("📡 Llamando a atmService.getAllATMsWithStatus()");
      const allATMsList = await atmService.getAllATMsWithStatus();

      // Si llegamos aquí, la petición fue exitosa
      console.log("✅ Total de ATMs obtenidos:", allATMsList.length);
      console.log("📋 Lista de ATMs:", allATMsList);

      // Guardar todos los ATMs
      setAllAtms(allATMsList);

      // Aplicar filtro actual
      applyATMFilter(allATMsList, atmFilter);

      // Limpiar cualquier error de conexión previo
      setConnectionError(null);

      // Actualizar el mapa global de cajas asignadas a ATMs
      console.log("🔄 Actualizando mapa global de cajas asignadas después de cargar ATMs");
      await actualizarMapaCajasAsignadas();

      return allATMsList;
    } catch (error) {
      console.error("❌ Error al cargar todos los ATMs:", error);

      // Log detallado del error
      let errorMessage = "Error desconocido al cargar empleados";

      if (error instanceof Error) {
        console.error("❌ Mensaje de error:", error.message);
        console.error("❌ Tipo de error:", error.name);
        errorMessage = error.message;

        // Mostrar mensaje de error en la UI
        showConnectionError(`Error al cargar empleados: ${errorMessage}`);
      }

      // Usar datos vacíos para evitar romper la UI
      setAllAtms([]);
      setAtms([]);
      return [];
    } finally {
      setLoadingAtms(false);
    }
  };

  // Aplicar filtro a la lista de ATMs
  const applyATMFilter = (atmList: ATMDTO[] = allAtms, filter: 'all' | 'active' | 'inactive' = atmFilter) => {
    console.log(`🔍 Aplicando filtro "${filter}" a ${atmList.length} ATMs`);

    let filteredATMs: ATMDTO[] = [];

    switch (filter) {
      case 'all':
        filteredATMs = atmList;
        break;
      case 'active':
        filteredATMs = atmList.filter(atm => atm.is_active === true);
        break;
      case 'inactive':
        filteredATMs = atmList.filter(atm => atm.is_active === false);
        break;
    }

    console.log(`✅ ATMs filtrados (${filter}):`, filteredATMs.length);
    setAtms(filteredATMs);
  };

  // Verificar asignaciones de ATM a cajas para actualizar la UI
  const verifyATMBoxAssignments = async () => {
    try {
      console.log("🔍 Verificando asignaciones de ATM a cajas...");

      if (allAtms.length === 0) {
        console.log("⚠️ No hay ATMs cargados para verificar asignaciones");
        return;
      }

      // Bloquear actualizaciones de estado durante la verificación para evitar renders parciales
      setLoading(true);

      // Trabajar con una copia local de las cajas para actualizar todas juntas al final
      let cajasActualizadas = [...cajas];
      let huboCambios = false;

      // Para cada ATM activo, verificar si tiene cajas asignadas
      for (const atm of allAtms) {
        if (!atm.is_active) continue; // Solo verificar ATMs activos

        try {
          console.log(`🔍 Verificando asignaciones para ATM: ${atm.name_atm} (${atm.id_atm})`);
          const response = await boxService.getBoxesByAtm(atm.id_atm);

          if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
            console.log(`✅ ATM ${atm.name_atm} tiene ${response.data.length} cajas asignadas:`, response.data);

            // Para cada caja asignada a este ATM, actualizar nuestra copia local
            for (const assignedBox of response.data) {
              // Buscar la caja en nuestra copia local
              const cajaIndex = cajasActualizadas.findIndex(c => c.id_box === assignedBox.id_box);

              if (cajaIndex !== -1) {
                console.log(`✏️ Actualizando caja ${assignedBox.name_box} con información de ATM`);

                // Solo actualizar si la caja no tiene ya un ATM o si el ATM es diferente
                const cajaActual = cajasActualizadas[cajaIndex];
                if (!cajaActual.atm || cajaActual.atm.id_atm !== atm.id_atm) {
                  // Actualizar la caja con la información del ATM
                  cajasActualizadas[cajaIndex] = {
                    ...cajaActual,
                    atm: {
                      id_atm: atm.id_atm,
                      name_atm: atm.name_atm,
                      alias: atm.alias,
                      email: atm.email,
                      phone: atm.phone
                    },
                    is_open: assignedBox.is_open // También actualizar el estado abierto/cerrado
                  };
                  huboCambios = true;
                }
              } else {
                console.log(`⚠️ Caja ${assignedBox.id_box} no encontrada en el estado local`);
              }
            }
          } else {
            console.log(`ℹ️ ATM ${atm.name_atm} no tiene cajas asignadas`);
          }
        } catch (error) {
          console.error(`❌ Error al verificar asignaciones para ATM ${atm.id_atm}:`, error);
        }
      }

      // Actualizar el estado una sola vez con todas las cajas actualizadas
      if (huboCambios) {
        console.log("✅ Actualizando estado de cajas con las asignaciones verificadas");
        // Usar una función de estado para garantizar que estamos actualizando basado en el estado más reciente
        setCajas(prevCajas => {
          // Combinar los cambios con cualquier otro cambio que pudiera haber ocurrido mientras verificábamos
          const cajaIds = new Set(cajasActualizadas.map(c => c.id_box));
          // Mantener cajas que no estaban en nuestra copia original
          const cajasNoVerificadas = prevCajas.filter(c => !cajaIds.has(c.id_box));
          // Combinar las cajas actualizadas con las no verificadas
          return [...cajasActualizadas, ...cajasNoVerificadas];
        });
      } else {
        console.log("ℹ️ No se encontraron cambios en las asignaciones");
      }

      console.log("✅ Verificación de asignaciones completada");

    } catch (error) {
      console.error("❌ Error al verificar asignaciones de ATM a cajas:", error);
    } finally {
      // Asegurarnos de quitar el estado de carga
      setLoading(false);
    }
  };

  // Función optimizada para actualizar el mapa global de cajas asignadas a ATMs
  const actualizarMapaCajasAsignadas = async () => {
    try {
      console.log("🔄 Actualizando mapa global de cajas asignadas a ATMs...");

      // Usar la nueva función optimizada para obtener todas las asignaciones de una sola vez
      const { boxMap, atmBoxes } = await atmService.getAllBoxesAssignedToATMs();

      if (boxMap.size > 0) {
        console.log(`✅ Método optimizado: Encontradas ${boxMap.size} cajas asignadas a ATMs`);

        // Actualizar el mapa global
        setCajasAsignadas(boxMap);

        // Actualizar las cajas que necesiten actualización
        const cajasParaActualizar = new Map<string, any>();

        // Para cada ATM que tiene cajas asignadas
        atmBoxes.forEach((boxes, atmId) => {
          // Encontrar el ATM en la lista local
          const atm = allAtms.find(a => a.id_atm === atmId);

          if (atm) {
            // Para cada caja asignada a este ATM
            boxes.forEach(boxFromServer => {
              // Verificar si necesitamos actualizar la información de la caja local
              const cajaLocal = cajas.find(c => c.id_box === boxFromServer.id_box);

              if (cajaLocal) {
                const necesitaActualizacion =
                  !cajaLocal.atm ||
                  cajaLocal.atm.id_atm !== atmId ||
                  cajaLocal.is_open !== boxFromServer.is_open;

                if (necesitaActualizacion) {
                  console.log(`🔄 Detectada discrepancia en caja ${boxFromServer.id_box}. Marcando para actualización.`);
                  cajasParaActualizar.set(boxFromServer.id_box, {
                    ...boxFromServer,
                    atm: {
                      id_atm: atm.id_atm,
                      name_atm: atm.name_atm,
                      alias: atm.alias,
                      email: atm.email,
                      phone: atm.phone,
                      dni: atm.dni
                    }
                  });
                }
              }
            });
          }
        });

        // Si hay cajas para actualizar, actualizar el estado local
        if (cajasParaActualizar.size > 0) {
          console.log(`🔄 Actualizando ${cajasParaActualizar.size} cajas en el estado local`);

          setCajas(prevCajas => {
            return prevCajas.map(caja => {
              const actualizacion = cajasParaActualizar.get(caja.id_box);
              if (actualizacion) {
                console.log(`✏️ Actualizando caja ${caja.id_box} con datos del servidor`);
                return {
                  ...caja,
                  is_open: actualizacion.is_open,
                  atm: actualizacion.atm
                };
              }
              return caja;
            });
          });
        }

        return;
      }

      // Si no obtuvimos datos, intentar el método anterior
      console.log("⚠️ No se obtuvieron asignaciones con el método optimizado, usando método alternativo");

      // Crear un nuevo mapa para almacenar las asignaciones
      const nuevoMapa = new Map<string, string>();
      let cajasEncontradas = 0;

      // Objeto para rastrear actualizaciones necesarias en cajas
      const cajasParaActualizar = new Map<string, any>();

      // Para cada ATM, consultar las cajas asignadas
      for (const atm of allAtms) {
        try {
          // Solo consultar ATMs activos
          if (!atm.is_active) continue;

          console.log(`🔍 Consultando cajas asignadas al ATM: ${atm.name_atm} (${atm.id_atm})`);
          const response = await boxService.getBoxesByAtm(atm.id_atm);

          // Si hay cajas asignadas, agregarlas al mapa
          if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
            console.log(`✅ ATM ${atm.name_atm} tiene ${response.data.length} cajas asignadas`);

            // Para cada caja asignada a este ATM, registrarla en el mapa
            response.data.forEach(boxFromServer => {
              nuevoMapa.set(boxFromServer.id_box, atm.id_atm);
              cajasEncontradas++;

              // Verificar si necesitamos actualizar la información de la caja local
              const cajaLocal = cajas.find(c => c.id_box === boxFromServer.id_box);

              // Si la caja existe localmente pero no tiene ATM o tiene un ATM diferente
              if (cajaLocal) {
                const necesitaActualizacion =
                  !cajaLocal.atm ||
                  cajaLocal.atm.id_atm !== atm.id_atm ||
                  cajaLocal.is_open !== boxFromServer.is_open;

                if (necesitaActualizacion) {
                  console.log(`🔄 Detectada discrepancia en caja ${boxFromServer.id_box}. Marcando para actualización.`);
                  cajasParaActualizar.set(boxFromServer.id_box, {
                    ...boxFromServer,
                    atm: {
                      id_atm: atm.id_atm,
                      name_atm: atm.name_atm,
                      alias: atm.alias,
                      email: atm.email,
                      phone: atm.phone,
                      dni: atm.dni
                    }
                  });
                }
              }
            });
          }
        } catch (error) {
          console.error(`❌ Error al consultar cajas para ATM ${atm.id_atm}:`, error);
        }
      }

      // Actualizar el estado con el nuevo mapa
      setCajasAsignadas(nuevoMapa);

      console.log(`✅ Mapa global actualizado: ${cajasEncontradas} cajas asignadas a ATMs`);
      console.log("📊 Detalle del mapa:", Array.from(nuevoMapa.entries()));

      // Si hay cajas para actualizar, actualizar el estado local
      if (cajasParaActualizar.size > 0) {
        console.log(`🔄 Actualizando ${cajasParaActualizar.size} cajas en el estado local`);

        setCajas(prevCajas => {
          return prevCajas.map(caja => {
            const actualizacion = cajasParaActualizar.get(caja.id_box);
            if (actualizacion) {
              console.log(`✏️ Actualizando caja ${caja.id_box} con datos del servidor`);
              return {
                ...caja,
                is_open: actualizacion.is_open,
                atm: actualizacion.atm
              };
            }
            return caja;
          });
        });
      }

    } catch (error) {
      console.error("❌ Error al actualizar mapa global de cajas asignadas:", error);
    }
  };

  // Función para cambiar el filtro de ATMs
  const handleFilterChange = (filter: 'all' | 'active' | 'inactive') => {
    console.log(`🔄 Cambiando filtro a "${filter}"`);
    setAtmFilter(filter);
    applyATMFilter(allAtms, filter);
  };

  return (
    <MainLayout>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <h3>
            <i className="fas fa-box-open"></i> Apertura y Cierre Caja
          </h3>
          <a className="nav-link active mt-4" href="#">
            ADMIN
          </a>        </div>
      </nav>      {/* Componente integrado para crear y listar cajas - Diseño mejorado */}
      <div className="container-fluid">
        {/* Mensaje de error de conexión */}
        {connectionError && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4 d-flex align-items-center"
            style={{
              zIndex: 9999,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              maxWidth: '90%',
              width: 'auto',
            }}
          >
            <i className="fas fa-exclamation-triangle me-2"></i>
            <div>{connectionError}</div>
            <button
              type="button"
              className="btn-close ms-3"
              onClick={() => setConnectionError(null)}
            ></button>
          </div>
        )}

        {/* Sección de cajas creadas */}
        {/* Header estilo FoodLy */}
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 text-white"
              style={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
              }}>
              <div className="d-flex align-items-center">
                <i className="fas fa-cash-register me-2" style={{ fontSize: '24px' }}></i>
                <h3 className="mb-0">Lista de cajas</h3>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <button
                  className="btn btn-light btn-sm"
                  onClick={async () => {
                    console.log("🔄 Ejecutando sincronización completa desde header");
                    try {
                      // 1. Actualizar ATMs
                      await loadAllATMs();
                      // 2. Actualizar mapa global
                      await actualizarMapaCajasAsignadas();
                      // 3. Actualizar cajas
                      await loadCajas();
                    } catch (error) {
                      console.error("❌ Error en sincronización completa:", error);
                      showConnectionError("Error al sincronizar. Intente de nuevo.");
                    }
                  }}
                  disabled={loading}
                  style={{ borderRadius: '8px' }}
                  title="Sincronizar cajas, empleados y asignaciones"
                >
                  <i className="fas fa-sync-alt me-1"></i>
                  {loading ? 'Sincronizando...' : 'Sincronizar'}
                </button>
                {isAdmin() && (
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    style={{ borderRadius: '8px' }}
                    onClick={() => setIsCreateCajaModalOpen(true)}
                  >
                    <i className="fas fa-plus me-1"></i>
                    Crear Caja
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Componente CajaCard para mostrar cajas */}
        <CajaCard
          cajas={cajas}
          loading={loading}
          onRefresh={undefined}
          onActivarCaja={handleActivarCaja}
          onToggleCaja={handleToggleCaja}
          user={user}
          isAdmin={isAdmin()}
          cajasAsignadas={cajasAsignadas}
        />
      </div>      {/* Modal para asignar ATM */}
      {showATMModal && selectedCajaForATM && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user me-2"></i>
                  Asignar Empleado a Caja
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowATMModal(false);
                    setSelectedCajaForATM(null);
                    // Quitar loading de la caja si se cancela
                    setCajas(prevCajas =>
                      prevCajas.map(caja =>
                        caja.id_box === selectedCajaForATM
                          ? { ...caja, isLoading: false }
                          : caja
                      )
                    );
                  }}
                ></button>
              </div><div className="modal-body">
                <div className="mb-3">
                  <p className="text-muted">
                    Seleccione un empleado para asignar a la caja:
                  </p>
                  <div className="alert alert-info d-flex align-items-center">
                    <i className="fas fa-info-circle me-2"></i>
                    <small>
                      <strong>Nota:</strong> Solo los empleados activos pueden ser asignados a cajas. Los empleados inactivos aparecen deshabilitados.
                    </small>
                  </div>

                  {/* Botones de filtrado */}
                  <div className="btn-group w-100 mb-3">
                    <button
                      type="button"
                      className={`btn ${atmFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleFilterChange('all')}
                    >
                      <i className="fas fa-users me-1"></i> Todos
                    </button>
                    <button
                      type="button"
                      className={`btn ${atmFilter === 'active' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => handleFilterChange('active')}
                    >
                      <i className="fas fa-check-circle me-1"></i> Activos
                    </button>
                    <button
                      type="button"
                      className={`btn ${atmFilter === 'inactive' ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => handleFilterChange('inactive')}
                    >
                      <i className="fas fa-pause-circle me-1"></i> Inactivos
                    </button>
                  </div>
                </div>

                {loadingAtms ? (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    Cargando empleados...
                  </div>
                ) : atms.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="fas fa-exclamation-triangle fa-2x mb-2 d-block text-warning"></i>
                    No hay empleados {atmFilter === 'active' ? 'activos' : atmFilter === 'inactive' ? 'inactivos' : ''} disponibles
                    {atmFilter !== 'all' && (
                      <div className="mt-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleFilterChange('all')}
                        >
                          Ver todos los empleados
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="list-group">
                    {atms.map((atm) => (
                      <div
                        key={atm.id_atm}
                        className={`list-group-item d-flex justify-content-between align-items-center ${!atm.is_active ? 'bg-light' : ''}`}
                      >
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center">
                            <i className={`fas fa-user ${atm.is_active ? 'text-primary' : 'text-muted'} me-2`}></i>
                            <div>
                              <h6 className="mb-0">
                                {atm.name_atm}
                                {atm.is_active ? (
                                  <span className="badge bg-success ms-2 small">
                                    <i className="fas fa-check-circle me-1"></i>
                                    Activo
                                  </span>
                                ) : (
                                  <span className="badge bg-warning text-dark ms-2 small">
                                    <i className="fas fa-pause-circle me-1"></i>
                                    Inactivo
                                  </span>
                                )}
                              </h6>
                              <small className="text-muted">
                                <i className="fas fa-at me-1"></i>
                                {atm.alias}
                              </small>
                              {atm.email && (
                                <div>
                                  <small className="text-muted">
                                    <i className="fas fa-envelope me-1"></i>
                                    {atm.email}
                                  </small>
                                </div>
                              )}
                              {!atm.is_active && (
                                <div>
                                  <small className="text-warning">
                                    <i className="fas fa-exclamation-triangle me-1"></i>
                                    Este empleado está marcado como inactivo
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className={`btn btn-sm ${atm.is_active ? 'btn-success' : 'btn-secondary'}`}
                            onClick={() => {
                              console.log("🔘 Botón Asignar clickeado");
                              console.log("🔘 atm.id_atm:", atm.id_atm);
                              console.log("🔘 selectedCajaForATM:", selectedCajaForATM);
                              handleAsignarATM(atm.id_atm);
                            }}
                            disabled={!atm.is_active || atm.isLoading}
                            title={
                              atm.isLoading ? "Asignando empleado..." :
                                atm.is_active ? "Asignar empleado a la caja" :
                                  "No se puede asignar empleados inactivos"
                            }
                          >
                            {atm.isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                Asignando...
                              </>
                            ) : (
                              <>
                                <i className={`fas ${atm.is_active ? 'fa-check' : 'fa-ban'} me-1`}></i>
                                {atm.is_active ? 'Asignar' : 'No disponible'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mensaje de error y botón de reintento */}
                {(allAtms.length === 0 || atms.length === 0) && connectionError && (
                  <div className="alert alert-danger mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Error al cargar los empleados
                      </div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => loadAllATMs()}
                      >
                        <i className="fas fa-sync-alt me-1"></i> Reintentar
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <div className="w-100 d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      Mostrando {atms.length} de {allAtms.length} empleados
                    </small>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      // Al cerrar el modal, verificar nuevamente las asignaciones para mantener coherencia
                      setSelectedCajaForATM(null);
                      // Asegurarnos que el estado es consistente
                      setTimeout(() => verifyATMBoxAssignments(), 100);
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Arqueo Inicial */}
      {showArqueoModal && selectedCajaForArqueo && (
        <ArqueoModal
          isOpen={showArqueoModal}
          onClose={() => {
            setShowArqueoModal(false);
            setSelectedCajaForArqueo(null);
          }}
          onSubmit={(arqueoData: ArqueoInitDTO) => {
            abrirCajaConArqueo(selectedCajaForArqueo!, arqueoData);
          }}
          isLoading={cajas.find(c => c.id_box === selectedCajaForArqueo)?.isLoading || false}
          cajaNombre={cajas.find(c => c.id_box === selectedCajaForArqueo)?.name_box || 'Caja'}
        />
      )}

      {/* Modal para crear caja */}
      <CreateCajaModal
        isOpen={isCreateCajaModalOpen}
        onClose={() => setIsCreateCajaModalOpen(false)}
        onSubmit={handleCreateCaja}
        isLoading={isCreatingCaja}
        cajasExistentes={cajas}
      />

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={() => {
          confirmationModal.onConfirm();
          closeConfirmationModal();
        }}
        onClose={closeConfirmationModal}
        type={confirmationModal.type}
        confirmText={confirmationModal.confirmText}
        isLoading={confirmationModal.isLoading}
      />

      {/* Modal de notificación */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        title={notificationModal.title}
        message={notificationModal.message}
        type={notificationModal.type || 'info'}
        onClose={closeNotificationModal}
      />
    </MainLayout>
  );
}

export default function AperturaCierrePage() {
  return (
    <ProtectedRoute requiredModule="/apertura-cierre">
      <AperturaCierreContent />
    </ProtectedRoute>
  );
}
