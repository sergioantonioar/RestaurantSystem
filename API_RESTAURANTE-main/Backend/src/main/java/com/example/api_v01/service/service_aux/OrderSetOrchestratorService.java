package com.example.api_v01.service.service_aux;

import com.example.api_v01.dto.entityLike.CustomerOrderDTO;
import com.example.api_v01.dto.entityLike.OrderSetDTO;
import com.example.api_v01.dto.response.OrderSetWithListCustomerOrderDTO;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.utils.Tuple;
import net.sf.jasperreports.engine.JRException;

import java.util.List;
import java.util.UUID;

public interface OrderSetOrchestratorService {
    Tuple saveCompleteOrderSet(UUID id_arching, String name_client, List<CustomerOrderDTO> listCustomer) throws NotFoundException, BadRequestException;
    OrderSetWithListCustomerOrderDTO getOrderSetDTO(UUID id_orderSet) throws NotFoundException;
    List<OrderSetDTO> findOrderSetByArching(UUID id_arching,int page) throws NotFoundException;
    List<OrderSetDTO> findOrderSetByCustomer(String name,int page) throws NotFoundException;
    byte[] generateInvoice(UUID id_orderSet) throws JRException, NotFoundException;
}
