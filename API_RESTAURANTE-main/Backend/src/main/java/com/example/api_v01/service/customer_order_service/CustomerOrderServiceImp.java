package com.example.api_v01.service.customer_order_service;

import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.CustomerOrder;
import com.example.api_v01.model.OrderSet;
import com.example.api_v01.model.Product;
import com.example.api_v01.repository.CustomerOrderRepository;
import com.example.api_v01.repository.ProductRepository;
import com.example.api_v01.service.order_set_service.OrderSetService;
import com.example.api_v01.service.product_service.ProductService;
import com.example.api_v01.service.product_stock_service.ProductStockService;
import com.example.api_v01.utils.CustomerOrderMovement;
import com.example.api_v01.utils.ExceptionMessage;
import com.example.api_v01.utils.Tuple;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerOrderServiceImp implements CustomerOrderService, ExceptionMessage {

    private final CustomerOrderRepository customerOrderRepository;

    private final OrderSetService orderSetService;

    private final ProductService productService;

    private final ProductStockService productStockService;


    //Se usa en un servicio aux, NO USAR EN CONTROLADOR
    @Override
    public CustomerOrder saveCustomerOrder(UUID id_product,UUID id_orderSet,Integer count) throws NotFoundException, BadRequestException {

        Product product = productService.getProduct(id_product);
        OrderSet orderSet = orderSetService.getOrderSet(id_orderSet);
        CustomerOrder customerOrder = CustomerOrderMovement.createCustomerOrder(orderSet,product,count);
        if(customerOrder==null){
            throw new BadRequestException(STOCK_DISCOUNT);
        }
        productStockService.discountStockById(product.getStock().getId_product_stock(),count);
        return customerOrderRepository.save(customerOrder);

    }

    //Poner en el controlador un adverticia en caso de que salva el valor 0.0 (la lista esta vacia)
    //Se usa en un servicio aux, NO USAR EN CONTROLADOR
    @Override
    public Double TotalAmountOrderSet(UUID id_OrderSet) {
        return customerOrderRepository.findByOrderSetId(id_OrderSet)
                .stream()
                .map( customerOrder -> customerOrder.getTotal_rice())
                .reduce(0.0,Double::sum);
    }

    //Se usa en un servicio aux, NO USAR EN CONTROLADOR
    @Override
    public List<CustomerOrder> listCustomerOrdersByOrderSet(UUID id_OrderSet) {
        return customerOrderRepository
                .findByOrderSetId(id_OrderSet);
    }


}
