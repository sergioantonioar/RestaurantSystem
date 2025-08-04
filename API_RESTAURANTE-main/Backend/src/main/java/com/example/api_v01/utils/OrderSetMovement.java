package com.example.api_v01.utils;

import com.example.api_v01.dto.entityLike.OrderSetDTO;
import com.example.api_v01.dto.response.CustomerOrderResponseDTO;
import com.example.api_v01.dto.response.OrderSetResponseDTO;
import com.example.api_v01.dto.response.OrderSetWithListCustomerOrderDTO;
import com.example.api_v01.model.Arching;
import com.example.api_v01.model.CustomerOrder;
import com.example.api_v01.model.OrderSet;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class OrderSetMovement {
    //Se utiliza para crear el orderset
    public static OrderSet CreateOrderSet(Arching arching, String name_client){
        return OrderSet.builder()
                .name_client(name_client)
                .date_order(LocalDate.now())
                .time_order(LocalTime.now())
                .arching(arching)
                .build();
    }

    public static OrderSetResponseDTO CreateOrderSetResponseDTO(OrderSet orderSet){
        return OrderSetResponseDTO.builder()
                .name_client(orderSet.getName_client())
                .time_order(orderSet.getTime_order())
                .date_order(orderSet.getDate_order())
                .total_order(orderSet.getTotal_order())
                .build();
    }

    public static OrderSetDTO CreateOrderSetDTO(OrderSet orderSetDTO){
        return OrderSetDTO.builder()
                .id_order_set(orderSetDTO.getId_order_set())
                .name_client(orderSetDTO.getName_client())
                .total_order(orderSetDTO.getTotal_order())
                .build();
    }

    public static List<OrderSetDTO> CrearListOrderSetDTO(List<OrderSet> orderSetList){
        return orderSetList.stream()
                .map(OrderSetMovement::CreateOrderSetDTO)
                .toList();
    }

    public static OrderSetWithListCustomerOrderDTO createOrderSetWithListCustomerOrderDTO(OrderSet orderSet, List<CustomerOrder>listCustomerOrders){
        return OrderSetWithListCustomerOrderDTO.builder()
                .id_orderSet(orderSet.getId_order_set())
                .name_client(orderSet.getName_client())
                .total_order(orderSet.getTotal_order())
                .orders(convertListCustomerOrder(listCustomerOrders))
                .build();
    }

    public static List<CustomerOrderResponseDTO> convertListCustomerOrder(List<CustomerOrder> customerOrders){
        return customerOrders.stream()
                .map(CustomerOrderMovement::convertCustomerOrderToCustomerOrderResponseDTO)
                .toList();
    }

}
