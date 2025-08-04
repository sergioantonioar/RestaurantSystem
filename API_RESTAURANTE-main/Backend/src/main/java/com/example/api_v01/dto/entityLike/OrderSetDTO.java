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
public class OrderSetDTO {

    private UUID id_order_set;

    private String name_client;

    private Double total_order;

}
