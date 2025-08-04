package com.example.api_v01.controller;

import com.example.api_v01.dto.entityLike.ProductStockDTO;
import com.example.api_v01.dto.response.ProductWithStockDTO;
import com.example.api_v01.dto.response.StockChangeRequestDTO;
import com.example.api_v01.dto.response.SuccessMessage;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.enums.Category;
import com.example.api_v01.service.product_stock_service.ProductStockService;

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
@RequestMapping("stock")
@RequiredArgsConstructor
public class StockController {   //CONTROLADOR TESTEADO, LISTO PARA USAR

    private final ProductStockService productStockService;

    @Operation(
            summary = "Obtener la lista de stock con paginación",
            description = "Devuelve una lista paginada de todos los stocks disponibles junto con los nombres de los productos asociados. Se debe especificar el número de página con el parámetro 'page'."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de stock paginada obtenida correctamente."),
    })
    //Me devuelve la lista de stock con los nombre del producto al que pertenecen
    @GetMapping("/list")
    public ResponseEntity<?> getAllStocks(@RequestParam int page) {
        SuccessMessage<List<ProductWithStockDTO>> successMessage = SuccessMessage.<List<ProductWithStockDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("La lista de stock (!puede que la lista este vacia)")
                .data(productStockService.getAllProductStock(page))
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(
            summary = "Obtener stock por categoría con paginación",
            description = "Devuelve una lista paginada de stock cuyos productos pertenecen a la categoría especificada. Se debe especificar el número de página con el parámetro 'page'."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de stock paginada obtenida correctamente."),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada."),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida.")
    })
    //Me devuelve la lista de stock con los nombre del producto al que pertenecen por la categoria del producto
    @GetMapping("/list/category")
    public ResponseEntity<?> getAllStocksCategory(@RequestParam Category category,@RequestParam int page) throws NotFoundException {
        SuccessMessage<List<ProductWithStockDTO>> successMessage = SuccessMessage.<List<ProductWithStockDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("La lista de stock (!puede que la lista este vacia)")
                .data(productStockService.getAllProductStockByCategory(category,page))
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(
            summary = "Obtener stock por nombre del producto con paginación",
            description = "Devuelve una lista paginada de stock cuyos productos tienen el nombre especificado. Se debe especificar el número de página con el parámetro 'page'."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de stock paginada obtenida correctamente."),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado."),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida.")
    })
    //Me devuelve la lista de stock con los nombre del producto al que pertenecen por el nombre del producto
    @GetMapping("/list/nameProduct")
    public ResponseEntity<?> getAllStocksNameProduct(@RequestParam String nameProduct,@RequestParam int page) throws NotFoundException {
        SuccessMessage<List<ProductWithStockDTO>> successMessage = SuccessMessage.<List<ProductWithStockDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("La lista de stock (!puede que la lista este vacia)")
                .data(productStockService.getAllProductStockByNameProduct(nameProduct,page))
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(
            summary = "Obtener stock por ID",
            description = "Devuelve un stock específico utilizando su identificador único."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Stock encontrado correctamente."),
            @ApiResponse(responseCode = "404", description = "Stock no encontrado.")
    })
    //me devuelve un stock con el nombre del producto al que pertenecen mediante el ID del stock
    @GetMapping("/{id_stock}")
    public ResponseEntity<?> getStock(@PathVariable UUID id_stock) throws NotFoundException {
        ProductWithStockDTO productStock = productStockService.getProductStockById(id_stock);
        SuccessMessage<ProductWithStockDTO>successMessage = SuccessMessage.<ProductWithStockDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Stock encontrado!!")
                .data(productStock)
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(
            summary = "Limpiar un stock",
            description = "Limpia el stock (lo pone a 0) utilizando el identificador único del stock."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Stock limpiado correctamente."),
            @ApiResponse(responseCode = "404", description = "Stock no encontrado.")
    })
    //limpia el stock a 0 pasandole el id del stock
    @PostMapping("/clean/{id_stock}")
    public ResponseEntity<?> cleanStock(@PathVariable UUID id_stock) throws NotFoundException {
        ProductWithStockDTO stock = productStockService.cleanStockById(id_stock);
        SuccessMessage<ProductWithStockDTO>successMessage = SuccessMessage.<ProductWithStockDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Stock encontrado!!")
                .data(stock)
                .build();
        return ResponseEntity.ok().body(successMessage);
    }

    @Operation(
            summary = "Descontar stock",
            description = "Descuenta (reduce) una cierta cantidad de stock de un producto proporcionando los datos necesarios en el DTO."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Monto descontado del stock correctamente."),
            @ApiResponse(responseCode = "404", description = "Stock no encontrado."),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos.")
    })
    //me descuenta cierta cantidad de un producto pasandole un dto
    @PostMapping("/discount")
    public ResponseEntity<?> discountStock(@RequestBody StockChangeRequestDTO stockChangeRequestDTO) throws NotFoundException,BadRequestException {
        ProductWithStockDTO stock = productStockService.discountStockById(stockChangeRequestDTO);
        SuccessMessage<ProductWithStockDTO>successMessage = SuccessMessage.<ProductWithStockDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Se desconto el monto del stock")
                .data(stock)
                .build();
        return ResponseEntity.ok().body(successMessage);
    }

    @Operation(
            summary = "Aumentar stock",
            description = "Aumenta una cierta cantidad de stock de un producto proporcionando los datos necesarios en el DTO."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Monto aumentado en el stock correctamente."),
            @ApiResponse(responseCode = "404", description = "Stock no encontrado.")
    })
    //me aumenta una cierta cantidad de un producto pasandole un dto
    @PostMapping("/increase")
    public ResponseEntity<?> increaseStock(@RequestBody StockChangeRequestDTO stockChangeRequestDTO) throws NotFoundException{
        ProductWithStockDTO stock = productStockService.increaseStockById(stockChangeRequestDTO);
        SuccessMessage<ProductWithStockDTO>successMessage = SuccessMessage.<ProductWithStockDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Se aumento el monto del stock")
                .data(stock)
                .build();
        return ResponseEntity.ok().body(successMessage);
    }

    @Operation(
            summary = "Actualizar stock",
            description = "Actualiza un stock existente proporcionando los datos necesarios en el cuerpo de la solicitud."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Stock actualizado correctamente."),
            @ApiResponse(responseCode = "404", description = "Stock no encontrado."),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos.")
    })
    //MANDA UN JSON JUNTO CON EL ID DEL PRODUCTO PARA ACTUALIZAR
    @PatchMapping("/")
    public ResponseEntity<?> updateProduct(@RequestBody ProductStockDTO stockDTO) throws NotFoundException,BadRequestException {
        ProductWithStockDTO stock = productStockService.updateStockById(stockDTO);
        SuccessMessage<ProductWithStockDTO>successMessage= SuccessMessage.<ProductWithStockDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Se actualizo el producto correctamente")
                .data(stock)
                .build();
        return ResponseEntity.ok().body(successMessage);
    }
}
