// Define la estructura de un producto en el sistema
export interface Producto {
  id_product: number
  name_product: string
  // Categoría a la que pertenece el producto (por ejemplo: "criollos", "Marinos", etc.)
  category: string
  price: number
  additional_observation: string
}
