package com.example.api_v01.dto.entityLike;

import com.example.api_v01.model.enums.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {

    private UUID id_product;

    private String name_product;

    private Double price;

    private String additional_observation;

    private Category category;


}
