package com.example.api_v01.dto.response;

import com.example.api_v01.dto.entityLike.CustomerOrderDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SaveOrderSetListCustomerDTO {
    private String name_cliente;
    private List<CustomerOrderDTO> orders;
}
