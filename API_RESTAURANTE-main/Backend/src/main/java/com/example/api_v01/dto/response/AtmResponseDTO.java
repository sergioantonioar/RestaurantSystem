package com.example.api_v01.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AtmResponseDTO {

    private String name_atm;

    private String alias;

    private String email;

    private String phone;

    private String dni;

}
