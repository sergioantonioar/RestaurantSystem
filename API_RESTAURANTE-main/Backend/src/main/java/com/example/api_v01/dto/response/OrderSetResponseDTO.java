package com.example.api_v01.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderSetResponseDTO {
    private String name_client;
    private LocalDate date_order;
    private LocalTime time_order;
    private Double total_order;
}
