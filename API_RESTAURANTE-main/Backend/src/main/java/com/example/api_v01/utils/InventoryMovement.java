package com.example.api_v01.utils;

import com.example.api_v01.dto.entityLike.ProductStockDTO;
import com.example.api_v01.dto.response.ProductWithStockDTO;
import com.example.api_v01.model.Product;
import com.example.api_v01.model.ProductStock;

import java.util.List;

public class InventoryMovement {


    public static List<ProductWithStockDTO> getListProductWithStock(List<Product> products) {
        return products.stream()
                .map(InventoryMovement::getProductWithStockDTO)
                .toList();
    }

    public static ProductWithStockDTO getProductWithStockDTO(Product product) {
        return ProductWithStockDTO.builder()
                .product_name(product.getName_product())
                .product_stock(
                        ProductStockDTO.builder()
                                .id_Stock(product.getStock().getId_product_stock())
                                .ini_stock(product.getStock().getIni_stock())
                                .current_stock(product.getStock().getCurrent_stock())
                                .total_sold(product.getStock().getTotal_sold())
                                .build()
                )
                .build();
    }

    public static ProductStock discountStock(Product product,Integer count) {
        ProductStock stock = product.getStock();
        if(stock.getCurrent_stock() >= count) {;
            stock.setCurrent_stock( stock.getCurrent_stock() - count );
            stock.setTotal_sold( stock.getTotal_sold() + count );
            return stock;
        }
        return null;
    }

    public static ProductStock increaseStock(Product product ,Integer count) {
        ProductStock stock = product.getStock();
        stock.setIni_stock( stock.getIni_stock() + count );
        stock.setCurrent_stock( stock.getCurrent_stock() + count );
        return stock;
    }

    public static ProductStock ValidationStock(ProductStock stock, ProductStockDTO productStockDTO){
        if( productStockDTO.getIni_stock() != null && productStockDTO.getIni_stock() >=0 ){
            stock.setIni_stock(productStockDTO.getIni_stock());
        }
        if( productStockDTO.getCurrent_stock() != null && productStockDTO.getCurrent_stock() >=0 ){
            stock.setCurrent_stock(productStockDTO.getCurrent_stock());
        }
        if( productStockDTO.getTotal_sold() != null && productStockDTO.getTotal_sold() >= 0 ){
            stock.setTotal_sold(productStockDTO.getTotal_sold());
        }
        return stock;
    }

    public static ProductStock CleanStock(Product product){
        ProductStock stock = product.getStock();
        stock.setIni_stock(0);
        stock.setCurrent_stock(0);
        stock.setTotal_sold(0);
        return stock;
    }
}
