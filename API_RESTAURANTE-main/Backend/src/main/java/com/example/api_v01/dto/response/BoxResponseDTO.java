package com.example.api_v01.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BoxResponseDTO {
    private String name_box;
    private Boolean is_open = false;
}
