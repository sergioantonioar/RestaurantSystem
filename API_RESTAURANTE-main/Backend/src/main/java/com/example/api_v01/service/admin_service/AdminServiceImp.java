package com.example.api_v01.service.admin_service;

import com.example.api_v01.dto.entityLike.AdminDTO;
import com.example.api_v01.dto.response.RegisterAdmin;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.Admin;
import com.example.api_v01.model.User;
import com.example.api_v01.model.enums.Rol;
import com.example.api_v01.repository.AdminRepository;
import com.example.api_v01.utils.AdminMovement;
import com.example.api_v01.utils.ExceptionMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminServiceImp implements AdminService , ExceptionMessage {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    //Solo se usa una vez para crear al admin
    @Override
    public Admin saveAdmin(RegisterAdmin registerAdmin) {

        User user = User.builder()
                .role(Rol.ADMIN)
                .username(registerAdmin.getUsername())
                .password(passwordEncoder.encode(registerAdmin.getPassword()))
                .build();

        Admin admin = Admin.builder()
                .name_admin(registerAdmin.getName())
                .email_admin(registerAdmin.getEmail())
                .dni_admin(registerAdmin.getDni())
                .user_admin(user)
                .build();

        return adminRepository.save(admin);

    }

    @Override
    public Admin findById(UUID id) throws NotFoundException {
        return adminRepository.findById(id).orElseThrow( () -> new NotFoundException(ADMIN_NOT_FOUND));
    }

    @Override
    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    public AdminDTO findAdminByUser(UUID user_id) throws NotFoundException {
        Admin admin = adminRepository.findByUserID(user_id)
                .orElseThrow( () -> new NotFoundException(ADMIN_NOT_FOUND));
        return AdminMovement.getAdminDTO(admin);
    }

}
