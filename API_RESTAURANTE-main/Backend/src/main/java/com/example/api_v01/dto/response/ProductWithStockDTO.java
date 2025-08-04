package com.example.api_v01.dto.response;

import com.example.api_v01.dto.entityLike.ProductStockDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ProductWithStockDTO {
    private String product_name;
    private ProductStockDTO product_stock;
}
