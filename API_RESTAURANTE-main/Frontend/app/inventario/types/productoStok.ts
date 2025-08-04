export interface ProductStock {
  id_Stock: string;
  ini_stock: number;
  current_stock: number;
  total_sold: number;
}
export interface ProductStockData {
  id_product_stock: string; // ID del producto
  count: number; // Detalles del stock del producto   
  
}
export interface ProductStockItem {
  product_name: string;
  product_stock: ProductStock;
}

export interface ProductStockResponse {
  status: number;
  message: string;
  data: ProductStockItem[];
}
