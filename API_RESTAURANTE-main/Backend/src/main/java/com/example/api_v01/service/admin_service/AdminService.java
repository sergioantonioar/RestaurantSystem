package com.example.api_v01.service.admin_service;

import com.example.api_v01.dto.entityLike.AdminDTO;
import com.example.api_v01.dto.response.RegisterAdmin;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.Admin;

import java.util.List;
import java.util.UUID;

public interface AdminService {
    Admin saveAdmin(RegisterAdmin registerAdmin);
    Admin findById(UUID id) throws NotFoundException;
    List<Admin> findAll();
    AdminDTO findAdminByUser(UUID user_id) throws NotFoundException;
}
