package com.example.api_v01.dto.response;

import com.example.api_v01.model.enums.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ProductResponseDTO {
    private String name_product;
    private Double price;
    private String additional_observation;
    private Category category;
}
