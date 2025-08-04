// Importamos axios para realizar solicitudes HTTP al backend
import axios from "axios";

// Importamos el tipo Empleado para definir correctamente las estructuras de datos esperadas
import { Empleado } from "../types/empleado";

// Importamos URL Base de la API
import { API_BASE_URL } from "@/services/api";

// URL base de la API para productos del backend en Spring Boot
const EMPLEADO_API_URL = `${API_BASE_URL}atm`;

/**
 * Obtiene todos los empleados desde el backend.
 * Se espera un token JWT para la autorización.
 *
 * @param token - Token de autenticación JWT
 * @param page - Número de página para paginación (opcional, por defecto 0)
 * @returns Promesa con un array de empleados y el estado de la respuesta
 */
export const getAllEmpleados = (token: string, page: number = 0) =>
  axios.get<{ status: number; data: Empleado[] }>(
    `${EMPLEADO_API_URL}/list?page=${page}`,
    {
      headers: { Authorization: `Bearer ${token}` }, // Se pasa el token en el encabezado
    }
  );

/**
 * Crea un nuevo empleado en el sistema, asociado a un administrador.
 * @param empleado - Objeto que contiene los datos del nuevo empleado (sin ID)
 * @param idAdmin - ID del administrador que está creando el empleado
 * @param token - Token de autenticación JWT
 * @returns Promesa con la respuesta del backend
 * */
export const createEmpleado = (
  empleado: Omit<Empleado, "id_empleado">, // Se omite el ID porque lo genera el backend
  // ID del administrador que está creando el empleado
  idAdmin: string,
  // Token de autenticación JWT
  token: string
) =>
  axios.post(`${EMPLEADO_API_URL}/${idAdmin}`, empleado, {
    headers: {
      Authorization: `Bearer ${token}`, // Token JWT para autenticación
      "Content-Type": "application/json", // Se especifica que se envía JSON
    },
  });

/**
 * Actualiza un empleado existente parcialmente.
 * @param atmid - ID del empleado que se desea actualizar
 * @param empleado - Objeto con los campos a actualizar
 * @param token - Token de autenticación JWT
 * @return Promesa con la respuesta del backend
 * */
export const updateEmpleado = (
  atmId: string, // ID del empleado que se desea actualizar
  empleado: Partial<Empleado>, // Se permite actualizar solo algunos campos
  token: string // Token de autenticación JWT
) =>
  axios.patch(`${EMPLEADO_API_URL}/${atmId}`, empleado, {
    headers: {
      Authorization: `Bearer ${token}`, // Token JWT para autenticación
      "Content-Type": "application/json", // Se especifica que se envía JSON
    },
  });

/**
 * Elimina un empleado por su ID.
 * @param atmId - ID del empleado a eliminar
 * @param token - Token de autenticación JWT
 * @return Promesa con la respuesta del backend
 * */
export const deleteEmpleado = (atmId: string, token: string) =>
  axios.delete(`${EMPLEADO_API_URL}/${atmId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Token JWT para autenticación
    },
  });

/**
 * Busca empleados por nombre.
 * @param token - Token de autenticación JWT
 * @param searchByName - Nombre o parte del nombre a buscar
 * @param page - Número de página para paginación (opcional, por defecto 0)
 * @return Promesa con un array de empleados que coinciden con la búsqueda
 * */
 export const searchEmpleados = (
  token: string,
  searchByName: string,
  page: number = 0
) =>
  axios.get<{ status: number; data: Empleado[] }>(
    `${EMPLEADO_API_URL}/searchByName?name=${searchByName}&page=${page}`,
    {
      headers: { Authorization: `Bearer ${token}` }, // Se pasa el token en el encabezado
    }
  );

// Asignar un usuario a un ATM
export const assignUserToAtm = (
  atmId: string,
  token: string,
  payload: { username: string; password: string }
) =>
  axios.post(
    `${EMPLEADO_API_URL}/${atmId}/assign-user`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );