import { useEffect,useState} from "react";
import { Empleado } from "../types/empleado";
import { getAllEmpleados } from "../services/empleadoService";
/**
 * Hook personalizado para manejar la lógica de carga de empleados desde la API.
 *
 * @param token - Token JWT de autenticación (puede ser null si el usuario no está autenticado)
 * @returns Un objeto con:
 *  - empleados: lista de empleados obtenidos
 *  - loading: estado booleano que indica si se están cargando los datos
 *  - setEmpleados: función para modificar manualmente la lista de empleados
 */
export default function useEmpleados(token: string | null, page: number = 0) {
  // Estado para almacenar los empleados obtenidos
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  // Estado para indicar si los datos están siendo cargados
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect para ejecutar la carga de empleados cuando se monta el componente o cambia el token
  useEffect(() => {
    // Si no hay token, no se realiza la solicitud
    if (!token) return;

    // Se activa el estado de carga
    setLoading(true);

    // Se llama al servicio para obtener los empleados
    getAllEmpleados(token, page)
      .then((res) => {
        // Si la respuesta tiene estado 200, se actualiza el estado con los empleados
        if (res.data.status === 200) {
          setEmpleados(res.data.data);
        } else {
          setEmpleados([]); // Si no es 200, se limpia la lista de empleados
        }
      })
      .catch((err) => {
        // En caso de error, se muestra en consola
        console.error("Error cargando empleados", err);
        setEmpleados([]); // Se limpia la lista de empleados en caso de error
      })
      .finally(() => {
        // Al finalizar la solicitud, se desactiva el estado de carga
        setLoading(false);
      });
  }, [token, page]);

  // Se retorna el estado y la función de actualización manual
  return { empleados, loading, setEmpleados }
}