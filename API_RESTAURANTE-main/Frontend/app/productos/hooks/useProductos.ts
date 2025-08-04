// Importamos los hooks de React
import { useEffect, useState } from "react"

// Importamos el tipo Producto para tipar el estado correctamente
import { Producto } from "../types/producto"

// Importamos la función para obtener productos desde el backend
import { getAllProductos } from "../services/productoService"

/**
 * Hook personalizado para manejar la lógica de carga de productos desde la API.
 * 
 * @param token - Token JWT de autenticación (puede ser null si el usuario no está autenticado)
 * @returns Un objeto con:
 *  - productos: lista de productos obtenidos
 *  - loading: estado booleano que indica si se están cargando los datos
 *  - setProductos: función para modificar manualmente la lista de productos
 */
export default function useProductos(token: string | null, page: number = 0) {
  // Estado para almacenar los productos obtenidos
  const [productos, setProductos] = useState<Producto[]>([])

  // Estado para indicar si los datos están siendo cargados
  const [loading, setLoading] = useState<boolean>(false)

  // useEffect para ejecutar la carga de productos cuando se monta el componente o cambia el token
  useEffect(() => {
    // Si no hay token, no se realiza la solicitud
    if (!token) return

    // Se activa el estado de carga
    setLoading(true)

    // Se llama al servicio para obtener los productos
    getAllProductos(token,page)
      .then((res) => {
        // Si la respuesta tiene estado 200, se actualiza el estado con los productos
        if (res.data.status === 200)
          {
            setProductos(res.data.data)
          } else {
              setProductos([]) // Si no es 200, se limpia la lista de productos
              
          } 
            
      })
      .catch((err) => {
        // En caso de error, se muestra en consola
        console.error("Error cargando productos", err)
        setProductos([]) // Se limpia la lista de productos en caso de error
      })
      .finally(() => {
        // Al finalizar la solicitud, se desactiva el estado de carga
        setLoading(false)
      })

  // El efecto se ejecuta cada vez que el token cambia
  }, [token,page])

  // Se retorna el estado y la función de actualización manual
  return { productos, loading, setProductos }
}
