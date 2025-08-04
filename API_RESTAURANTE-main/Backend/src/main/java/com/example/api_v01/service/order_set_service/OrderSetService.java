package com.example.api_v01.service.order_set_service;

import com.example.api_v01.dto.entityLike.OrderSetDTO;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.OrderSet;

import java.util.List;
import java.util.UUID;

public interface OrderSetService {

    OrderSet save(OrderSet orderSet);

    //Se utiliza para un servico,No para controlador
    OrderSet saveBaseOrderSet(UUID id_arching, String name_cliente) throws NotFoundException, BadRequestException;

    //Se utiliza para un servico,No para controlador
    Double totalAmountArching(UUID id_arching);


    //Se utiliza para un servico,No para controlador
    OrderSet getOrderSet(UUID id_orderSet) throws NotFoundException;



    List<OrderSetDTO> getOrderSetByNameCustomer(String name,int page) throws NotFoundException;

    List<OrderSetDTO> getOrderSetsByArching(UUID id_arching,int page) throws NotFoundException ;

}
