package com.example.api_v01.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderSetWithListCustomerOrderDTO {

    private UUID id_orderSet;

    private String name_client;

    private Double total_order;

    private List<CustomerOrderResponseDTO> orders;

}
