package com.example.api_v01.utils;

import com.example.api_v01.dto.entityLike.AdminDTO;
import com.example.api_v01.model.Admin;

public class AdminMovement {
    public static AdminDTO getAdminDTO(Admin admin) {
        return AdminDTO.builder()
                .id_admin(admin.getId_admin())
                .email_admin(admin.getEmail_admin())
                .name_admin(admin.getName_admin())
                .dni_admin(admin.getDni_admin())
                .build();
    }
}
