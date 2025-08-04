package com.example.api_v01.dto.entityLike;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BoxDTO {
    private UUID id_box;
    private String name_box;
    private LocalDate date;
    private Boolean is_open = false;
}
