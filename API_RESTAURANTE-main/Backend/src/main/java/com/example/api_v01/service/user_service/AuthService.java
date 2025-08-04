package com.example.api_v01.service.user_service;

import com.example.api_v01.dto.entityLike.AdminDTO;
import com.example.api_v01.dto.entityLike.AtmDTO;
import com.example.api_v01.dto.response.AuthResponse;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.jwt.JwtUtils;
import com.example.api_v01.model.User;
import com.example.api_v01.model.enums.Rol;
import com.example.api_v01.repository.UserRepository;
import com.example.api_v01.service.admin_service.AdminService;
import com.example.api_v01.service.atm_service.ATMService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    private final AdminService adminService;
    private final ATMService atmService;

    public AuthResponse<?> authenticate(String username, String password) throws NotFoundException {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);

        Authentication authentication = authenticationManagerBuilder
                .getObject().authenticate(authenticationToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateToken(authentication);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User no encontrado"));

        if(user.getRole() == Rol.ADMIN){
            AdminDTO adminDTO = adminService.findAdminByUser(user.getId_user());
            return AuthResponse.<AdminDTO>builder()
                    .token(jwt)
                    .role(user.getRole())
                    .data(adminDTO)
                    .build();
        }

        if(user.getRole() == Rol.ATM){
            AtmDTO atmDTO = atmService.getAtmByUser(user.getId_user());
            return AuthResponse.<AtmDTO>builder()
                    .token(jwt)
                    .role(user.getRole())
                    .data(atmDTO)
                    .build();
        }

        throw new NotFoundException("Rol no soportado");
    }

}
