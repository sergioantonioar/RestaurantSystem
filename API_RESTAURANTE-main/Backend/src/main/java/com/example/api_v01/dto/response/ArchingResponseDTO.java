package com.example.api_v01.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
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
public class ArchingResponseDTO {

    private LocalDate date;

    private LocalTime star_time;

    @Builder.Default
    private LocalTime end_time=null;

    private Double init_amount;

    @Builder.Default
    private Double final_amount=null;

    @Builder.Default
    private Double total_amount=null;

    @Builder.Default
    private BoxResponseDTO box=null;
}
