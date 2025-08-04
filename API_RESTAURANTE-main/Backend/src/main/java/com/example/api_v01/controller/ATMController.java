package com.example.api_v01.controller;

import com.example.api_v01.dto.entityLike.AtmDTO;
import com.example.api_v01.dto.response.AtmResponseDTO;
import com.example.api_v01.dto.response.RegisterAtmUserDTO;
import com.example.api_v01.dto.response.SuccessMessage;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.service.atm_service.ATMService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("atm")
@RequiredArgsConstructor
public class ATMController { //CONTROLADOR TESTEADO, LISTO PARA USAR

    private final ATMService atmservice;

    //Recibe un DTO para registrar los datos del atm,se necesita el id del admin para guardar al atm
    @Operation(
            summary = "Registrar un nuevo ATM",
            description = "Crea un nuevo ATM asociado a un administrador utilizando el ID del administrador y los datos suministrados en el DTO."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "ATM creado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Administrador no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos")
    })
    @PostMapping("/{adminId}")
    public ResponseEntity<?> saveATM(@PathVariable("adminId") UUID adminId, @RequestBody AtmResponseDTO atmDTO) throws NotFoundException {
        AtmResponseDTO createdATM = atmservice.saveATM(adminId, atmDTO);
        SuccessMessage<AtmResponseDTO> successMessage = SuccessMessage.<AtmResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("ATM creado exitosamente")
                .data(createdATM)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(successMessage);
    }

    @Operation(
            summary = "Asignar un usuario a un ATM",
            description = "Asigna un usuario a un cajero automático específico mediante su ID y los datos del usuario proporcionados en el DTO."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario asignado exitosamente al ATM"),
            @ApiResponse(responseCode = "404", description = "ATM no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos")
    })
    //Recibe un DTO para registrar el user de un atm ,se necesita el id del atm para asignarle el user
    @PostMapping("/{atmId}/assign-user")
    public ResponseEntity<?> assignUserATM(@PathVariable("atmId") UUID atmId, @RequestBody RegisterAtmUserDTO registerATMDTOUser) throws NotFoundException {
        AtmResponseDTO updatedATM = atmservice.assingUserATM(atmId, registerATMDTOUser);
        SuccessMessage<AtmResponseDTO> successMessage = SuccessMessage.<AtmResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Usuario asignado exitosamente al ATM")
                .data(updatedATM)
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(
            summary = "Obtener la lista de ATMs",
            description = "Devuelve una lista de todos los cajeros automáticos (ATMs) que existen en el sistema."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de ATMs obtenida correctamente")
    })
    //Me devuelve la lista de ATMs
    @GetMapping("/list")
    public ResponseEntity<?> getAllATMs(@RequestParam(defaultValue = "0") int page ) {
        List<AtmDTO> atmList = atmservice.getAllATMs(page);
        SuccessMessage<List<AtmDTO>> successMessage = SuccessMessage.<List<AtmDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Todos los ATMs recuperados exitosamente")
                .data(atmList)
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(
            summary = "Obtener información de un ATM por ID",
            description = "Devuelve la información del cajero automático (ATM) utilizando su identificador único."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "ATM recuperado exitosamente"),
            @ApiResponse(responseCode = "404", description = "ATM no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos")
    })
    //Me devuelve un ATM por su id
    @GetMapping("/{atmId}")
    public ResponseEntity<?> getAtmById(@PathVariable("atmId") UUID atmId) throws NotFoundException {
        AtmDTO atmDTO = atmservice.getAtmById(atmId);
        SuccessMessage<AtmDTO> successMessage = SuccessMessage.<AtmDTO>builder()
                .status(HttpStatus.OK.value())
                .message("ATM recuperado exitosamente")
                .data(atmDTO)
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(
            summary = "Buscar un ATM por nombre",
            description = "Devuelve la información del cajero automático (ATM) buscando por su nombre."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "ATM recuperado exitosamente"),
            @ApiResponse(responseCode = "404", description = "ATM no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos")
    })
    //Me devulve un ATM por su nombre
    @GetMapping("/searchByName")
    public ResponseEntity<?> getAtmByName(@RequestParam String name) throws NotFoundException {
        AtmDTO atmDTO = atmservice.getAtmByName(name);
        SuccessMessage<AtmDTO> successMessage = SuccessMessage.<AtmDTO>builder()
                .status(HttpStatus.OK.value())
                .message("ATM recuperado exitosamente")
                .data(atmDTO)
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(
            summary = "Eliminar un ATM por ID",
            description = "Elimina un cajero automático del sistema utilizando su identificador único."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "ATM eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "ATM no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos")
    })
    //Eliminar el ATM y su user
    @DeleteMapping("/{atmId}")
    public ResponseEntity<?> deleteATM(@PathVariable("atmId") UUID atmId) throws NotFoundException {
        atmservice.deleteATM(atmId);
        SuccessMessage<Void> successMessage = SuccessMessage.<Void>builder()
                .status(HttpStatus.NO_CONTENT.value())
                .message("ATM eliminado exitosamente")
                .build();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(successMessage);
    }

    @Operation(
            summary = "Actualizar datos de un ATM",
            description = "Actualiza la información de un cajero automático (ATM) utilizando su identificador único y los nuevos datos proporcionados."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "ATM actualizado exitosamente"),
            @ApiResponse(responseCode = "404", description = "ATM no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos")
    })
    //Actualiza un ATM pasandole un DTO con los datos actualizar ,necesita el id del atm
    @PatchMapping("/{atmId}")
    public ResponseEntity<?> updateATM(@PathVariable("atmId") UUID atmId, @RequestBody AtmResponseDTO atmDTO) throws NotFoundException {
        AtmResponseDTO updatedATM = atmservice.updateATM(atmId, atmDTO);
        SuccessMessage<AtmResponseDTO> successMessage = SuccessMessage.<AtmResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("ATM actualizado exitosamente")
                .data(updatedATM)
                .build();
        return ResponseEntity.ok(successMessage);
    }

}
