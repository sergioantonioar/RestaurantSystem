package com.example.api_v01.dto.entityLike;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class EmployeeDTO {

    private String name;

    private LocalDate date;

    private String alias;

    private String email;

    private String phone;

    private String dni;

}
