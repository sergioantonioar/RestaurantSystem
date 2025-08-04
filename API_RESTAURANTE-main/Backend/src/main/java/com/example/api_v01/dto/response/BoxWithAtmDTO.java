package com.example.api_v01.dto.response;

import com.example.api_v01.dto.entityLike.AtmDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BoxWithAtmDTO {

    private String name_box;

    private AtmDTO atm;

}
