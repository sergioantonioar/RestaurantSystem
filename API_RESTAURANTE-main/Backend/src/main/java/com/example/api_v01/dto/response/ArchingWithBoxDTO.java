package com.example.api_v01.dto.response;

import com.example.api_v01.dto.entityLike.BoxDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ArchingWithBoxDTO {
    private UUID id_arching;
    private LocalDate date;
    private LocalTime star_time;
    private LocalTime end_time;
    private Double init_amount;
    private Double final_amount;
    private Double total_amount;
    private BoxDTO box;
}
