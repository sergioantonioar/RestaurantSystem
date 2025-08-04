package com.example.api_v01.controller;

import com.example.api_v01.dto.entityLike.BoxDTO;
import com.example.api_v01.dto.response.*;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.service.box_service.BoxService;
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
@RequestMapping("box")
@RequiredArgsConstructor
public class BoxController { //CONTROLADOR LISTO PARA USAR

    private final BoxService boxservice;

    @Operation(
            summary = "Guardar una caja",
            description = "Crea una nueva caja asociada a un administrador, utilizando su ID y los datos proporcionados."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Caja creada exitosamente."),
            @ApiResponse(responseCode = "404", description = "Administrador no encontrado."),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos.")
    })
    //Guarda una caja pasandole un dto,se necesita el id del admin que lo creara
    @PostMapping("/{id_admin}")
    public ResponseEntity<?> saveBox(@PathVariable("id_admin") UUID id_admin, @RequestBody BoxNameDTO boxDTO) throws NotFoundException {
        SuccessMessage<BoxResponseDTO>successMessage = SuccessMessage.<BoxResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("La data del box creado")
                .data(boxservice.saveBox(id_admin,boxDTO))
                .build();
        return ResponseEntity.ok().body(successMessage);
    }

    @Operation(
            summary = "Asignar un ATM a una caja",
            description = "Asigna un cajero automático (ATM) a una caja específica utilizando sus identificadores únicos."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "ATM asignado exitosamente a la caja."),
            @ApiResponse(responseCode = "404", description = "Caja o ATM no encontrado."),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos.")
    })
    //asigna un cajero a una caja,necesita el id del atm y box
    @PostMapping("/{id_box}/assign-atm/{id_atm}")
    public ResponseEntity<?> assignAtmToBox(@PathVariable("id_box") UUID id_box, @PathVariable("id_atm") UUID id_atm) throws NotFoundException, BadRequestException {
        SuccessMessage<BoxWithAtmDTO>successMessage = SuccessMessage.<BoxWithAtmDTO>builder()
                .status(HttpStatus.OK.value())
                .message("La data del box creado:")
                .data(boxservice.assignAtmToBox(id_box,id_atm))
                .build();
        return ResponseEntity.ok().body(successMessage);
    }

    @Operation(
            summary = "Obtener caja por ID",
            description = "Devuelve los detalles de una caja utilizando su identificador único."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Datos de la caja obtenidos correctamente."),
            @ApiResponse(responseCode = "404", description = "Caja no encontrada.")
    })
    //traer una caja por su id
    @GetMapping("/{id_box}")
    public ResponseEntity<?> getBoxInfo(@PathVariable("id_box") UUID id_box) throws NotFoundException {
        SuccessMessage<BoxDTO>successMessage = SuccessMessage.<BoxDTO>builder()
                .status(HttpStatus.OK.value())
                .message("La data del box creado:")
                .data(boxservice.getBoxInfo(id_box))
                .build();
        return ResponseEntity.ok().body(successMessage);
    }

    @Operation(
            summary = "Cerrar una caja",
            description = "Cierra una caja específica, utilizando los identificadores de la caja y del arqueo relacionado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Caja cerrada exitosamente."),
            @ApiResponse(responseCode = "404", description = "Caja o arqueo no encontrado."),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos.")
    })
    //sirve para cerrar una caja pero necesita el id de box y de la caja que estan actual
    @PostMapping("off-box/{id_box}")
    public ResponseEntity<?> OffBox(@PathVariable("id_box") UUID id_box) throws NotFoundException, BadRequestException {
        SuccessMessage<BoxWithArchingDTO>successMessage = SuccessMessage.<BoxWithArchingDTO>builder()
                .status(HttpStatus.OK.value())
                .message("La caja se ha cerrado")
                .data(boxservice.toggleBoxDeactivationStatus(id_box))
                .build();
        return ResponseEntity.ok().body(successMessage);
    }

    @Operation(
            summary = "Abrir una caja",
            description = "Abre una caja específica y realiza un arqueo inicial utilizando el ID de la caja y los datos proporcionados en el DTO."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Caja abierta exitosamente."),
            @ApiResponse(responseCode = "404", description = "Caja no encontrada."),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos.")
    })
    //habre una caja y crea un arqueo pasandole su dto inicial,me devuelve el id del arqueo para la logica
    @PostMapping("on-box/{id_box}")
    public ResponseEntity<?> OnBox(@PathVariable("id_box") UUID id_box,@RequestBody ArchingInitDTO archingInitDTO) throws NotFoundException, BadRequestException {
        SuccessMessage<BoxResponseWithArchingDTO>successMessage = SuccessMessage.<BoxResponseWithArchingDTO>builder()
                .status(HttpStatus.OK.value())
                .message("La caja se ha abierto")
                .data(boxservice.toggleBoxActiveStatus(id_box,archingInitDTO))
                .build();
        return ResponseEntity.ok().body(successMessage);
    }

    @Operation(
            summary = "Listar todas las cajas",
            description = "Devuelve una lista de todas las cajas registradas en el sistema."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de cajas obtenida correctamente.")
    })
    //me da una lista de las cajas
    @GetMapping("/list")
    public ResponseEntity<?> getBoxes() {
        SuccessMessage<List<BoxDTO>>successMessage = SuccessMessage.<List<BoxDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("La data del box creado:")
                .data(boxservice.getBoxes())
                .build();
        return ResponseEntity.ok().body(successMessage);
    }

    @Operation(
            summary = "Obtener cajas asignadas a un cajero",
            description = "Busca y devuelve una lista de cajas asociadas a un cajero automático, utilizando el identificador del ATM."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cajas asociadas obtenidas correctamente."),
            @ApiResponse(responseCode = "404", description = "ATM no encontrado.")
    })
    //me busca la lista de cajas que esta asignadas a un determinado cajero,busca por el id del cajero
    @GetMapping("/by-atm/{id_atm}")
    public ResponseEntity<?> getBoxesByAtm(@PathVariable("id_atm") UUID id_atm) throws NotFoundException {
        SuccessMessage<List<BoxDTO>>successMessage = SuccessMessage.<List<BoxDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("La data del box creado:")
                .data(boxservice.getBoxesByAtm(id_atm))
                .build();
        return ResponseEntity.ok().body(successMessage);
    }


}
