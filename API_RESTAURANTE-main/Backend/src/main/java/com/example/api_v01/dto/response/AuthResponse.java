package com.example.api_v01.dto.response;

import com.example.api_v01.model.enums.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AuthResponse <T>{
    private String token;
    private Rol role;
    private T data;
}
