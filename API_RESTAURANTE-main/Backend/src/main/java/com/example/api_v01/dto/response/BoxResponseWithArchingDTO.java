package com.example.api_v01.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BoxResponseWithArchingDTO {
    private String name_box;
    private Boolean is_open;
    private UUID id_arching;
}
