package com.example.api_v01.dto.entityLike;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ProductStockDTO {

    private UUID id_Stock;

    private Integer ini_stock;

    private Integer current_stock;

    private Integer total_sold;

}
