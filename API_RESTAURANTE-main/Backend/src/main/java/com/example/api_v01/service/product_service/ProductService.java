package com.example.api_v01.service.product_service;

import com.example.api_v01.dto.entityLike.ProductDTO;
import com.example.api_v01.dto.entityLike.ProductStockDTO;
import com.example.api_v01.dto.response.ProductResponseDTO;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.Product;
import com.example.api_v01.model.enums.Category;
import com.example.api_v01.utils.Tuple;

import java.util.List;
import java.util.UUID;


public interface ProductService {

    Tuple<ProductResponseDTO,UUID> saveProduct(UUID id_admin, ProductResponseDTO product) throws NotFoundException;

    void deleteProduct(UUID id) throws NotFoundException;

    List<ProductDTO> getProducts(int page);

    ProductDTO getProductDTO(UUID id) throws NotFoundException;

    Product getProduct(UUID id) throws NotFoundException;

    ProductResponseDTO updateProduct(UUID id, ProductResponseDTO productDTO) throws NotFoundException;

    List<ProductDTO> getProductByCategory(Category categoria,int page) throws NotFoundException;

    List<ProductDTO> getProductByName(String name,int page) throws NotFoundException;

}
