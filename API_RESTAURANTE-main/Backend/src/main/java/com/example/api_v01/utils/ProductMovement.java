package com.example.api_v01.utils;

import com.example.api_v01.dto.entityLike.ProductDTO;
import com.example.api_v01.dto.response.ProductResponseDTO;
import com.example.api_v01.model.Admin;
import com.example.api_v01.model.Product;
import com.example.api_v01.model.ProductStock;

import java.util.List;

public class ProductMovement {

    public static List<ProductDTO> ListProductDTO(List<Product> products) {
        return products.stream()
                .map(ProductMovement::moveProductDTO)
                .toList();
    }

    public static ProductDTO moveProductDTO(Product product) {
        return ProductDTO.builder()
                .id_product(product.getId_Product())
                .name_product(product.getName_product())
                .price(product.getPrice())
                .category(product.getCategory())
                .additional_observation(product.getAdditional_observation())
                .build();
    }

    public static ProductResponseDTO moveProductResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .name_product(product.getName_product())
                .price(product.getPrice())
                .category(product.getCategory())
                .additional_observation(product.getAdditional_observation())
                .build();
    }

    public static Product createProductAndStock (Admin admin,ProductResponseDTO productDTO) {
        ProductStock stock = ProductStock.builder()
                .ini_stock(0)
                .current_stock(0)
                .total_sold(0)
                .build();
        return  Product.builder()
                .name_product(productDTO.getName_product())
                .price(productDTO.getPrice())
                .additional_observation(productDTO.getAdditional_observation())
                .category(productDTO.getCategory())
                .stock(stock)
                .admin(admin)
                .build();
    }

    public static Product ValidateProduct(Product existingProduct,ProductResponseDTO productDTO) {
        if (productDTO.getName_product() != null) {existingProduct.setName_product(productDTO.getName_product());}
        if (productDTO.getPrice() != null) {existingProduct.setPrice(productDTO.getPrice());}
        if (productDTO.getAdditional_observation() != null) {existingProduct.setAdditional_observation(productDTO.getAdditional_observation());}
        if (productDTO.getCategory() != null) {existingProduct.setCategory(productDTO.getCategory());}
        return existingProduct;
    }
}
