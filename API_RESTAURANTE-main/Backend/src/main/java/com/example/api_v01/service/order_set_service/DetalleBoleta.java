package com.example.api_v01.service.order_set_service;

import lombok.Data;

@Data
public class DetalleBoleta {
    private String cantidad;
    private String producto;
    private Double precio;
    private Double subtotal;
}
