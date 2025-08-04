package com.example.api_v01.dto.entityLike;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AtmDTO {

    private UUID id_atm;

    private String name_atm;

    private String alias;

    private String email;

    private String phone;

    private String dni;

    private Boolean is_active;

}
