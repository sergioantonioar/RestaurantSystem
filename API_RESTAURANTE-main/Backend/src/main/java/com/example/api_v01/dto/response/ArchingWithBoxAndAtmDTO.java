package com.example.api_v01.dto.response;

import com.example.api_v01.dto.entityLike.AtmDTO;
import com.example.api_v01.dto.entityLike.BoxDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ArchingWithBoxAndAtmDTO {
    BoxDTO boxDTO;
    AtmDTO atmDTO;
}
