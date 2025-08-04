package com.example.api_v01.dto.entityLike;

import com.example.api_v01.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AdminDTO {

    private UUID id_admin;

    private String name_admin;

    private String email_admin;

    private String dni_admin;

}
