package com.example.api_v01.utils;


public interface ExceptionMessage {
    final String ATM_NOT_FOUND = "ATM no encontrado";
    final String STOCK_NOT_FOUND = "Stock no encontrado";
    final String DISCOUNT_STOCK = "La cantidad ingresada a desconstar supera la actual del stock";
    final String USER_NOT_FOUND = "Usuario no encontrado";
    final String PRODUCT_NOT_FOUND = "El producto no encontrado";
    final String BOX_NOT_FOUND = "El box no encontrado";
    final String ARCHING_NOT_FOUND = "El arqueo no encontrado";
    final String ADMIN_NOT_FOUND = "El administrador no encontrado";

    final String BOX_OPEN="La caja ya esta abierta";
    final String BOX_CLOSE="La caja ya esta cerrada";
    final String user_find = "El atm ya tiene un usuario asociado";
    final String ARCHING_ERROR = "La caja ya esta controlado un arqueo";
    final String STOCK_DISCOUNT="No se puede quitar mas del stock actual del producto";
    final String ORDER_SET_NOT_FOUND = "La lista de ordenes del cliente no fue encontrada";
    final String CATEGORY_NOT_FOUND = "El categoria no encontrado";
    final String NAME_PRODUCT_NOT_FOUND = "Ninguno producto coincide con este nombre";
    final String IS_EMPTY_LIST_ORDER_SET = "No se puede guardar el orderSet si su lista de productos a ordenar esta vacia";
    final String ARCHING_FINISHED = "El arqueo que quiere asignar dejo de estar activo,Ya no puede ser usado";
}