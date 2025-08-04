package com.example.api_v01.service.product_stock_service;


import com.example.api_v01.dto.entityLike.ProductStockDTO;
import com.example.api_v01.dto.response.ProductWithStockDTO;
import com.example.api_v01.dto.response.StockChangeRequestDTO;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.enums.Category;

import java.util.List;
import java.util.UUID;

public interface ProductStockService {
    ProductWithStockDTO getProductStockById(UUID id) throws NotFoundException;
    List<ProductWithStockDTO> getAllProductStock(int page);
    List<ProductWithStockDTO> getAllProductStockByCategory(Category category,int page) throws NotFoundException;
    List<ProductWithStockDTO> getAllProductStockByNameProduct(String product,int page) throws NotFoundException;

    ProductWithStockDTO cleanStockById(UUID id) throws NotFoundException;
    ProductWithStockDTO increaseStockById(StockChangeRequestDTO stockChangeRequestDTO) throws NotFoundException;
    ProductWithStockDTO discountStockById(StockChangeRequestDTO stockChangeRequestDTO) throws NotFoundException , BadRequestException;
    ProductWithStockDTO discountStockById(UUID id_productStock, Integer count) throws NotFoundException , BadRequestException;
    ProductWithStockDTO updateStockById(ProductStockDTO productWithStockDTO) throws NotFoundException , BadRequestException;
}
