// Importamos axios para realizar solicitudes HTTP al backend
import axios from "axios";

// Importamos tipos correctos
import { ProductStockItem } from "../types/productoStok";

// Importamos URL Base de la API
import { API_BASE_URL } from "@/services/api";

// URL base de la API para stock de productos del backend en Spring Boot
const PRODUCT_API_URL = `${API_BASE_URL}stock`;

/**
 * Obtiene la lista de productos con su stock desde el backend.
 * Se espera un token JWT para la autorización.
 * 
 * @param token - Token de autenticación JWT
 * @returns Promesa con un array de productos con stock
 */
export const getAllProductStock = (token: string,page:number = 0) =>
  axios.get<{
    status: number;
    message: string;
    data: ProductStockItem[];
  }>(`${PRODUCT_API_URL}/list?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * Actualiza un producto existente parcialmente.
 * 
 * @param id - ID del producto que se desea actualizar
 * @param producto - Objeto con los campos a actualizar
 * @param token - Token de autenticación JWT
 * @returns Promesa con la respuesta del backend
 */
export const updateIncrementStockProduct = (
  id_product_stock: string,
  count: number,
  token: string,
) =>
  axios.post(`${PRODUCT_API_URL}/increase`, {
    id_product_stock,
    count,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "*/*"
    },
  })

  export const updateDecrementStockProduct = (
  id_product_stock: string,
  count: number,
  token: string
) => {
  return axios.post(`${PRODUCT_API_URL}/discount`, {
    id_product_stock,
    count,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}
/**
 * Resetea el stock de un producto por su ID.
 * 
 * @param id_stock - ID del stock a limpiar
 * @param token - Token de autenticación JWT
 * @returns Promesa con la respuesta del backend
 */
export const resetStockProduct = (id_stock: string, token: string) =>
  axios.post(`${PRODUCT_API_URL}/clean/${id_stock}`, '', {
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  })
