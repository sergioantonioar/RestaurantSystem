// Importamos los hooks de React
import { useEffect, useState } from "react";

// Importamos el tipo de productos con stock
import { ProductStockItem,ProductStockResponse } from "../types/productoStok";

// Importamos la función que obtiene los datos desde la API
import { getAllProductStock } from "../services/productStockService";

/**
 * Hook personalizado para cargar y gestionar el stock de productos desde la API.
 *
 * @param token - Token JWT de autenticación (puede ser null si el usuario no está autenticado)
 * @returns Objeto con:
 *  - productos: lista de productos con su stock
 *  - loading: estado de carga (true si está cargando)
 *  - setProductos: función para modificar manualmente el estado de productos
 */
export default function useProductoStock(token: string | null, page: number = 0) {
  // Estado que contiene la lista de productos con su stock
  const [productos, setProductos] = useState<ProductStockItem[]>([]);

  // Estado que indica si se está cargando la información
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect que se ejecuta al montar el componente o cuando cambia el token
  useEffect(() => {
    // Si no hay token, no se realiza la solicitud
    if (!token) return;

    // Se activa el estado de carga
    setLoading(true);

    // Se obtiene el stock desde el backend
    getAllProductStock(token, page)
      .then((res) => {
        // Si la respuesta es exitosa, se actualiza el estado
        if (res.data.status === 200) {
          setProductos(res.data.data);
        }else{
          setProductos([]);
          console.error("Error al cargar productos:", res.data.message);
        }
      })
      .catch((err) => {
        // Se muestra cualquier error en consola
        console.error("Error cargando productos", err);
        setProductos([]);
      })
      .finally(() => {
        // Al terminar, se desactiva el estado de carga
        setLoading(false);
      });
  }, [token,page]);

  // Se retorna el estado y funciones para utilizar en componentes
  return { productos, loading, setProductos };
}
