package com.example.api_v01.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class CustomerOrderResponseDTO {
    private String name_product;
    private Integer count;
    private Double total_rice;
}
