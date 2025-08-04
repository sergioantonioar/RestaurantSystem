package com.example.api_v01.controller;

import com.example.api_v01.model.Sugerencia;
import com.example.api_v01.service.sugerencia_service.SugerenciaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sugerencias")
@RequiredArgsConstructor
public class SugerenciaController {

    private final SugerenciaService sugerenciaService;

    @Operation(
            summary = "Guardar una nueva sugerencia",
            description = "Permite registrar una sugerencia enviada por un usuario, incluyendo su nombre, correo electrónico y contenido de la sugerencia."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sugerencia guardada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta: datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<Sugerencia> crearSugerencia(@RequestBody Sugerencia sugerencia) {
        Sugerencia guardada = sugerenciaService.guardarSugerencia(sugerencia);
        return ResponseEntity.ok(guardada);
    }
}
