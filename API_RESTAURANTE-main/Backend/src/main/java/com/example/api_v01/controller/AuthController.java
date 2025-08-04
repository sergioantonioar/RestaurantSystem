package com.example.api_v01.controller;

import com.example.api_v01.dto.response.AuthResponse;
import com.example.api_v01.dto.response.LoginDTO;

import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.service.user_service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("auth")
public class AuthController {

    public final AuthService authService;

    @Operation(
            summary = "Iniciar sesión",
            description = "Permite a un usuario autenticarse proporcionando su nombre de usuario y contraseña. Devuelve un token de autenticación o un mensaje de error si la autenticación falla."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Autenticación exitosa"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos")
    })
    //Me va pedir el user y password de un usuario para identificarlo
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) throws NotFoundException {
        AuthResponse authResponse = authService.authenticate(loginDTO.getUsername(), loginDTO.getPassword());
        return ResponseEntity.ok(authResponse);
    }

}
