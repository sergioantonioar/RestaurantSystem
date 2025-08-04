package com.example.api_v01.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import com.example.api_v01.dto.response.ProductResponseDTO;
import com.example.api_v01.dto.response.SuccessMessage;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.enums.Category;
import com.example.api_v01.utils.Tuple;
import com.example.api_v01.utils.UriGeneric;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.api_v01.dto.entityLike.ProductDTO;
import com.example.api_v01.service.product_service.ProductService;

@RestController
@RequestMapping("product")
@RequiredArgsConstructor
public class ProductController {    //CONTROLADOR TESTEADO, LISTO PARA USAR

    private final ProductService productService;

    @Operation(
            summary = "Buscar productos por categoría (paginado)",
            description = "Permite obtener todos los productos que pertenecen a una categoría específica. Soporta paginación mediante el parámetro 'page'."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de productos por categoría obtenida correctamente."),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada."),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida.")
    })
    //Busca todos los productos por categoria
    @GetMapping("/list/category")
    public ResponseEntity<?> getAllProductsByCategory(@RequestParam Category category,@RequestParam int page) throws NotFoundException{
        SuccessMessage <List<ProductDTO>> successMessage = SuccessMessage.<List<ProductDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lista de productos por categoria")
                .data(productService.getProductByCategory(category,page))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(successMessage);
    }

    @Operation(
            summary = "Buscar productos por nombre (paginado)",
            description = "Obtiene todos los productos que poseen el nombre especificado. Soporta paginación mediante el parámetro 'page'."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de productos por nombre obtenida correctamente."),
            @ApiResponse(responseCode = "404", description = "Productos no encontrados."),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida.")
    })
    //Busca todos los productos que tengan el mismo nombre
    @GetMapping("/list/name")
    public ResponseEntity<?> getAllProductsByName(@RequestParam String name,@RequestParam int page) throws NotFoundException {
        SuccessMessage <List<ProductDTO>> successMessage = SuccessMessage.<List<ProductDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lista de productos por nombre")
                .data(productService.getProductByName(name,page))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(successMessage);
    }

    @Operation(
            summary = "Obtener todos los productos (paginado)",
            description = "Devuelve la lista completa de productos registrados en el sistema. Soporta paginación mediante el parámetro 'page'."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de productos obtenida correctamente.")
    })
    // Me devuelve la lista entera de productos
    @GetMapping("/list")
    public ResponseEntity<?> getAllProducts(@RequestParam int page) throws NotFoundException {
        SuccessMessage<List<ProductDTO>> successMessage = SuccessMessage.<List<ProductDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("La lista de productos")
                .data(productService.getProducts(page))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(successMessage);
    }

    @Operation(
            summary = "Buscar un producto por ID",
            description = "Obtiene la información de un producto utilizando su identificador único."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Producto encontrado correctamente."),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado."),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida.")
    })
    // Me devuelve un producto buscado por su id
    @GetMapping("/{id_product}")
    public ResponseEntity<?> getProduct(@PathVariable UUID id_product) throws NotFoundException {
        SuccessMessage<ProductDTO> successMessage = SuccessMessage.<ProductDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Producto encontrado!!")
                .data(productService.getProductDTO(id_product))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(successMessage);
    }

    @Operation(
            summary = "Eliminar un producto por ID",
            description = "Elimina un producto específico junto con su inventario utilizando su identificador único."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Producto eliminado correctamente."),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado."),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida.")
    })
    // Elimina un producto junto con su stock, necesita el ID del producto
    @DeleteMapping("/{id_product}")
    public ResponseEntity<?> deleteProduct(@PathVariable UUID id_product) throws NotFoundException {
        productService.deleteProduct(id_product); //llamada
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // respuesta 204 exito
    }

    @Operation(
            summary = "Actualizar un producto",
            description = "Permite actualizar la información de un producto utilizando su ID y un cuerpo con los datos actualizados."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Producto actualizado correctamente."),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado."),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos.")
    })
    //actualiza el producto
    @PatchMapping("/{id_product}")
    public ResponseEntity<?> updateProduct(@PathVariable UUID id_product, @RequestBody ProductResponseDTO productDTO) throws NotFoundException {
        ProductResponseDTO updateProduct = productService.updateProduct(id_product, productDTO);
        SuccessMessage<ProductResponseDTO> successMessage = SuccessMessage.<ProductResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Producto Actualizado correctamente!!")
                .data(updateProduct)
                .build();
        return ResponseEntity.ok(successMessage);
    }

    @Operation(
            summary = "Crear un nuevo producto",
            description = "Permite crear un nuevo producto en el sistema, asociado al identificador del administrador que lo crea."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Producto creado correctamente."),
            @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos."),
            @ApiResponse(responseCode = "404", description = "Administrador no encontrado.")
    })
    //agrega un producto, necesita el ID del admin que lo va a agregar
    @PostMapping("/{id_admin}")
    public ResponseEntity<?> CreateProduct(@PathVariable UUID id_admin,@RequestBody ProductResponseDTO productDTO) throws NotFoundException {
        Tuple<ProductResponseDTO,UUID> product = productService.saveProduct(id_admin,productDTO);
        URI location = UriGeneric.GenereURI(
                "/product/{id_product}",
                product.getSecond()
        );
        SuccessMessage<ProductResponseDTO> successMessage = SuccessMessage.<ProductResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Producto creado correctamente!!")
                .data(product.getFirst())
                .build();
        return ResponseEntity.created(location).body(successMessage);
    }
}
