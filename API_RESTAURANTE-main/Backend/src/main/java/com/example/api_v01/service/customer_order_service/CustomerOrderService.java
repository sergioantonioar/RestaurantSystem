package com.example.api_v01.service.customer_order_service;

import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.CustomerOrder;

import java.util.List;
import java.util.UUID;

public interface CustomerOrderService {

    CustomerOrder saveCustomerOrder(UUID id_product,UUID id_orderSet,Integer count) throws NotFoundException, BadRequestException;

    Double TotalAmountOrderSet(UUID id_OrderSet);

    List<CustomerOrder>listCustomerOrdersByOrderSet(UUID id_OrderSet);
}
