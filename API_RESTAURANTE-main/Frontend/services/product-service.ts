import { apiClient } from "./apiClient";

export const productService = {
  async getProductList(page: number = 0) {
    return apiClient.get(`/product/list?page=${page}`);
  },
};
