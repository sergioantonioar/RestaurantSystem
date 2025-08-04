package com.example.api_v01.controller;

import com.example.api_v01.dto.entityLike.ArchingDTO;
import com.example.api_v01.dto.response.*;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.service.arching_service.ArchingService;
import com.example.api_v01.service.service_aux.ArchingProcessOrderSet;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("arching")
@RequiredArgsConstructor
public class ArchingController { //CONTROLADOR TESTEADO, LISTO PARA USAR


    private final ArchingService archingService;

    @Operation(
            summary = "Obtener todos los Arching",
            description = "Retorna una lista paginada de todos los registros de Arching almacenados en el sistema. " +
                    "El parámetro 'page' indica la página que se desea obtener (basado en cero)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado paginado de Arching obtenido correctamente"),
            @ApiResponse(responseCode = "400", description = "Parámetro de página inválido")
    })
    // Retorna todos los Arching con paginación
    @GetMapping("/list")
    public ResponseEntity<?> getAllArching(@RequestParam int page) {
        List<ArchingDTO> response = archingService.getAllArching(page);
        return ResponseEntity.ok(
                new SuccessMessage<>(HttpStatus.OK.value(), "Listado de Arching obtenido correctamente", response)
        );
    }

    @Operation(
            summary = "Obtener Arching por ID",
            description = "Devuelve los detalles de un registro de Arching utilizando su identificador único."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Arching encontrado correctamente"),
            @ApiResponse(responseCode = "404", description = "Arching no encontrado"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
    })
    // Traer Arching por su ID
    @GetMapping("/{id_arching}")
    public ResponseEntity<?> getArchingById(
            @PathVariable UUID id_arching
    ) throws NotFoundException {
        ArchingDTO response = archingService.getArchingDTOById(id_arching);
        return ResponseEntity.ok(
                new SuccessMessage<>(HttpStatus.OK.value(), "Arching obtenido correctamente", response)
        );
    }

    @Operation(
            summary = "Obtener Arching por ID del ATM",
            description = "Devuelve una lista paginada de registros de Arching asociados a un cajero automático específico. " +
                    "El parámetro 'page' indica la página que se desea obtener (basado en cero)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado paginado de Arching por ATM obtenido correctamente"),
            @ApiResponse(responseCode = "404", description = "ATM no encontrado"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
    })
    // Traer Arching por el ID del ATM con paginación
    @GetMapping("/ATM/{id_atm}")
    public ResponseEntity<?> getArchingByATM(
            @PathVariable UUID id_atm,
            @RequestParam int page
    ) throws NotFoundException {
        List<ArchingWithAtmDTO> response = archingService.getArchingByATM(id_atm,page);
        return ResponseEntity.ok(
                new SuccessMessage<>(HttpStatus.OK.value(), "Listado de Arching por ATM obtenido correctamente", response)
        );
    }

    @Operation(
            summary = "Obtener Arching por nombre del ATM",
            description = "Devuelve una lista paginada de registros de Arching asociados a un cajero automático especificado por nombre. " +
                    "El parámetro 'page' indica la página que se desea obtener (basado en cero)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado paginado de Arching por nombre de ATM obtenido correctamente"),
            @ApiResponse(responseCode = "404", description = "ATM no encontrado"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
    })
    // Traer Arching por el nombre del ATM con paginación
    @GetMapping("/ATM/name/{name_atm}")
    public ResponseEntity<?> getArchingByNameATM(
            @PathVariable String name_atm,
            @RequestParam int page
    ) throws NotFoundException {
        List<ArchingWithAtmDTO> response = archingService.getArchingByNameATM(name_atm,page);
        return ResponseEntity.ok(
                new SuccessMessage<>(HttpStatus.OK.value(), "Listado de Arching por nombre de ATM obtenido correctamente", response)
        );
    }

    @Operation(
            summary = "Obtener Arching por ID de la caja (Box)",
            description = "Devuelve una lista paginada de registros de Arching asociados a una caja específica (Box). " +
                    "El parámetro 'page' indica la página que se desea obtener (basado en cero)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado paginado de Arching por Box obtenido correctamente"),
            @ApiResponse(responseCode = "404", description = "Box no encontrado"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
    })
    // Traer Arching por el ID del Box con paginación
    @GetMapping("/Box/{id_box}")
    public ResponseEntity<?> getArchingByBox(
            @PathVariable UUID id_box,
            @RequestParam int page
    ) throws NotFoundException {
        List<ArchingWithBoxDTO> response = archingService.getArchingByBox(id_box,page);
        return ResponseEntity.ok(
                new SuccessMessage<>(HttpStatus.OK.value(), "Listado de Arching por Box obtenido correctamente", response)
        );
    }

    @Operation(
            summary = "Obtener Arching por nombre de la caja (Box)",
            description = "Devuelve una lista paginada de registros de Arching asociados a una caja especificada por nombre. " +
                    "El parámetro 'page' indica la página que se desea obtener (basado en cero)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado paginado de Arching por nombre de Box obtenido correctamente"),
            @ApiResponse(responseCode = "404", description = "Box no encontrado"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
    })
    // Traer Arching por el nombre del Box con paginación
    @GetMapping("/Box/name/{name_box}")
    public ResponseEntity<?> getArchingByNameBox(
            @PathVariable String name_box,
            @RequestParam int page
    ) throws NotFoundException {
        List<ArchingWithBoxDTO> response = archingService.getArchingByNameBox(name_box,page);
        return ResponseEntity.ok(
                new SuccessMessage<>(HttpStatus.OK.value(), "Listado de Arching por nombre de Box obtenido correctamente", response)
        );
    }

    @Operation(
            summary = "Generar PDF de resumen de arqueo de caja",
            description = "Genera y devuelve un archivo PDF con el resumen del arqueo de caja para el ID especificado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "PDF generado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Arching no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno al generar el PDF")
    })
    @GetMapping("/receipt/summary/{id_arching}")
    public ResponseEntity<byte[]> generateSummaryReceipt(@PathVariable UUID id_arching) {
        try {
            byte[] pdf = archingService.generateSummaryReceipt(id_arching);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "inline; filename=arqueo_resumen.pdf")
                    .header("Content-Type", "application/pdf")
                    .body(pdf);

        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

}
