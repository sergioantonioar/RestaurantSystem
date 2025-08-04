package com.example.api_v01.controller;


import com.example.api_v01.dto.response.SuccessMessage;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.service.admin_service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminservice;

    @Operation(summary = "Obtener un administrador por ID",
            description = "Busca un administrador utilizando un UUID único y devuelve la información del mismo si es encontrado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Administrador encontrado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Administrador no encontrado"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
    })
    @GetMapping("/{id_admin}")
    public ResponseEntity<?> getAdmin(@PathVariable UUID id_admin) throws NotFoundException {
        SuccessMessage<?> successMessage = SuccessMessage.builder()
                .status(HttpStatus.OK.value())
                .message("Se encontro el admin")
                .data(adminservice.findById(id_admin))
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(summary = "Obtener la lista de administradores",
            description = "Devuelve una lista de todos los administradores registrados en el sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de administradores devuelta exitosamente")
    })
    @GetMapping("/list")
    public ResponseEntity<?> getAdminList() {
        return ResponseEntity.ok(adminservice.findAll());
    }

}
