package com.example.api_v01.controller;

import com.example.api_v01.dto.entityLike.CustomerOrderDTO;
import com.example.api_v01.dto.response.OrderSetResponseDTO;
import com.example.api_v01.dto.response.SaveOrderSetListCustomerDTO;
import com.example.api_v01.dto.response.SuccessMessage;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.service.service_aux.OrderSetOrchestratorService;
import com.example.api_v01.utils.Tuple;
import com.example.api_v01.utils.UriGeneric;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JRException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("orderSet")
@RequiredArgsConstructor
public class OrderSetController { //CONTROLADOR TESTEADO, LISTO PARA USAR

    private final OrderSetOrchestratorService orderSetOrchestratorService;

    @Operation(
            summary = "Guardar un conjunto de pedidos",
            description = "Permite guardar un conjunto de pedidos realizado por un cliente asociado a un arqueo específico utilizando su ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "El conjunto de pedidos fue guardado correctamente."),
            @ApiResponse(responseCode = "404", description = "Arqueo no encontrado."),
            @ApiResponse(responseCode = "400", description = "Datos proporcionados son incorrectos.")
    })
    //Guardar el nombre del cliente y la lista de pedidos de este en un orderSet pasandole el id del arching y el DTO SaveOrderSetListCustomerDTO
    @PostMapping("/{id_arching}")
    public ResponseEntity<?> saveOrderSet(@PathVariable UUID id_arching,@RequestBody SaveOrderSetListCustomerDTO NameClientWithListOrdes) throws NotFoundException, BadRequestException {
        String nameClient = NameClientWithListOrdes.getName_cliente();
        List<CustomerOrderDTO> orders = NameClientWithListOrdes.getOrders();
        Tuple<OrderSetResponseDTO, UUID>tuple = orderSetOrchestratorService.saveCompleteOrderSet(id_arching,nameClient,orders);
        URI location = UriGeneric.GenereURI("/orderSet/{id_orderSet}",tuple.getSecond());
        SuccessMessage<?>successMessage=SuccessMessage.builder()
                .status(HttpStatus.OK.value())
                .message("Se guardo la lista de ordenes correctamente")
                .data(tuple.getFirst())
                .build();
        return ResponseEntity.created(location).body(successMessage);
    }

    @Operation(
            summary = "Obtener conjunto de pedidos por ID",
            description = "Devuelve la información de un conjunto de pedidos utilizando su identificador único."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Conjunto de pedidos recuperado correctamente."),
            @ApiResponse(responseCode = "404", description = "Conjunto de pedidos no encontrado.")
    })
    //Me devuelve los pedidos mediante el id del OrderSet
    @GetMapping("/{id_orderSet}")
    public ResponseEntity<?> getOrderSet(@PathVariable UUID id_orderSet) throws NotFoundException {
        SuccessMessage<?>successMessage=SuccessMessage.builder()
                .status(HttpStatus.OK.value())
                .message("Lista de cliente encontrada")
                .data(orderSetOrchestratorService.getOrderSetDTO(id_orderSet))
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(
            summary = "Obtener todos los conjuntos de pedidos por ID de arqueo",
            description = "Devuelve una lista paginada de conjuntos de pedidos registrados bajo un arqueo específico utilizando su identificador único. " +
                    "El parámetro 'page' indica el número de página a consultar."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de conjuntos de pedidos obtenida correctamente."),
            @ApiResponse(responseCode = "404", description = "Arqueo no encontrado.")
    })
    //Me devuelve la lista de pedidos mediante el id del arqueo que los registro, paginada
    @GetMapping("/list/ByArching/{id_arching}")
    public ResponseEntity<?> getListOrderSetByArching(@PathVariable UUID id_arching,@RequestParam int page) throws NotFoundException {
        SuccessMessage<?>successMessage=SuccessMessage.builder()
                .status(HttpStatus.OK.value())
                .message("Lista de cliente encontrada")
                .data(orderSetOrchestratorService.findOrderSetByArching(id_arching,page))
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(
            summary = "Obtener todos los conjuntos de pedidos por nombre de cliente",
            description = "Devuelve una lista paginada de conjuntos de pedidos realizados por un cliente específico utilizando su nombre. " +
                    "El parámetro 'page' indica el número de página a consultar."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de conjuntos de pedidos obtenida correctamente."),
            @ApiResponse(responseCode = "404", description = "Cliente no encontrado.")
    })
    //Me devuelve la lista de pedidos de un cliente mediante su nombre, paginada
    @GetMapping("/list/ByNameCustomer/{name_client}")
    public ResponseEntity<?> getListOrderSetByCustomer(@PathVariable String name_client,@RequestParam int page) throws NotFoundException {
        SuccessMessage<?>successMessage=SuccessMessage.builder()
                .status(HttpStatus.OK.value())
                .message("Lista de cliente encontrada")
                .data(orderSetOrchestratorService.findOrderSetByCustomer(name_client,page))
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(
            summary = "Generar boleta PDF para un conjunto de pedidos",
            description = "Genera y devuelve un archivo PDF con la boleta correspondiente al conjunto de pedidos especificado mediante su UUID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Boleta generada correctamente en formato PDF."),
            @ApiResponse(responseCode = "404", description = "Conjunto de pedidos no encontrado."),
            @ApiResponse(responseCode = "500", description = "Error interno al generar el PDF.")
    })
    @GetMapping("/invoice/{id_orderSet}")
    public ResponseEntity<byte[]> generarBoleta(@PathVariable UUID id_orderSet) throws JRException, NotFoundException {
        byte[] pdfBytes = orderSetOrchestratorService.generateInvoice(id_orderSet);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition
                .inline()
                .filename("boleta_" + id_orderSet + ".pdf")
                .build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
