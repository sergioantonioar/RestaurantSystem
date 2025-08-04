// Importamos axios para realizar solicitudes HTTP al backend
import axios from "axios"

// Importamos el tipo Producto para definir correctamente las estructuras de datos esperadas
import { Producto } from "../types/producto"

// Importamos URL Base de la API
import { API_BASE_URL } from "@/services/api";

// URL base de la API para productos del backend en Spring Boot
const PRODUCT_API_URL = `${API_BASE_URL}product`;

/**
 * Obtiene todos los productos desde el backend.
 * Se espera un token JWT para la autorización.
 * 
 * @param token - Token de autenticación JWT
 * @returns Promesa con un array de productos y el estado de la respuesta
 */
export const getAllProductos = (token: string,page:number=0) =>
  axios.get<{ status: number; data: Producto[] }>(`${PRODUCT_API_URL }/list?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` }, // Se pasa el token en el encabezado
  })

/**
 * Crea un nuevo producto en el sistema, asociado a un administrador.
 * 
 * @param producto - Objeto que contiene los datos del nuevo producto (sin ID)
 * @param idAdmin - ID del administrador que está creando el producto
 * @param token - Token de autenticación JWT
 * @returns Promesa con la respuesta del backend
 */
export const createProducto = (
  producto: Omit<Producto, "id_product">, // Se omite el ID porque lo genera el backend
  idAdmin: number,
  token: string
) =>
  axios.post(`${PRODUCT_API_URL }/${idAdmin}`, producto, {
    headers: {
      Authorization: `Bearer ${token}`, // Token JWT para autenticación
      "Content-Type": "application/json", // Se especifica que se envía JSON
    },
  })

/**
 * Actualiza un producto existente parcialmente.
 * 
 * @param id - ID del producto que se desea actualizar
 * @param producto - Objeto con los campos a actualizar
 * @param token - Token de autenticación JWT
 * @returns Promesa con la respuesta del backend
 */
export const updateProducto = (
  id: number,
  producto: Partial<Producto>, // Se permite actualizar solo algunos campos
  token: string
) =>
  axios.patch(`${PRODUCT_API_URL }/${id}`, producto, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

/**
 * Elimina un producto por su ID.
 * 
 * @param id - ID del producto a eliminar
 * @param token - Token de autenticación JWT
 * @returns Promesa con la respuesta del backend
 */
export const deleteProducto = (id: number, token: string) =>
  axios.delete(`${PRODUCT_API_URL }/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
