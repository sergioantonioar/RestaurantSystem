package com.example.api_v01.service.service_aux;

import com.example.api_v01.dto.entityLike.CustomerOrderDTO;
import com.example.api_v01.dto.entityLike.OrderSetDTO;
import com.example.api_v01.dto.response.CustomerOrderResponseDTO;
import com.example.api_v01.dto.response.OrderSetResponseDTO;
import com.example.api_v01.dto.response.OrderSetWithListCustomerOrderDTO;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.CustomerOrder;
import com.example.api_v01.model.OrderSet;
import com.example.api_v01.service.customer_order_service.CustomerOrderService;
import com.example.api_v01.service.order_set_service.DetalleBoleta;
import com.example.api_v01.service.order_set_service.OrderSetService;
import com.example.api_v01.utils.ExceptionMessage;
import com.example.api_v01.utils.OrderSetMovement;
import com.example.api_v01.utils.Tuple;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.util.JRLoader;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderSetOrchestratorServiceImp implements OrderSetOrchestratorService, ExceptionMessage {

    private final OrderSetService orderSetService;
    private final CustomerOrderService customerOrderService;

    //Sirve para guardar la lista junto con sus órdenes
    @Override
    public Tuple<OrderSetResponseDTO, UUID> saveCompleteOrderSet(
            UUID id_arching,
            String name_client,
            List<CustomerOrderDTO> listCustomer
    ) throws NotFoundException, BadRequestException {

        if(listCustomer.isEmpty()){
            throw new BadRequestException(IS_EMPTY_LIST_ORDER_SET);
        }

        OrderSet orderSet = orderSetService.saveBaseOrderSet(id_arching, name_client);

        for (CustomerOrderDTO customerOrderDTO : listCustomer) {
            customerOrderService.saveCustomerOrder(
                    customerOrderDTO.getId_product(),
                    orderSet.getId_order_set(),
                    customerOrderDTO.getCount()
            );
        }

        Double totalAmount = customerOrderService.TotalAmountOrderSet(orderSet.getId_order_set());

        orderSet.setTotal_order(totalAmount);

        orderSet = orderSetService.save(orderSet);

        OrderSetResponseDTO responseDTO = OrderSetMovement.CreateOrderSetResponseDTO(orderSet);

        return new Tuple<>(responseDTO, orderSet.getId_order_set());
    }

    //Me devulver un OrderSet Mas completo por el su id
    @Override
    public OrderSetWithListCustomerOrderDTO getOrderSetDTO(UUID id_orderSet) throws NotFoundException {
        OrderSet orderSet = orderSetService.getOrderSet(id_orderSet);
        List<CustomerOrder>customerOrders=customerOrderService.listCustomerOrdersByOrderSet(id_orderSet);
        return OrderSetMovement.createOrderSetWithListCustomerOrderDTO(orderSet, customerOrders);
    }

    //Me devulver una lista de OrderSet Mas completo por el id del arqueo
    @Override
    public List<OrderSetDTO> findOrderSetByArching(UUID id_arching,int page) throws NotFoundException {
        return orderSetService.getOrderSetsByArching(id_arching,page);
    }

    //Me devulver una lista de OrderSet Mas completo por el nombre del cliente
    @Override
    public List<OrderSetDTO> findOrderSetByCustomer(String name,int page) throws NotFoundException {
        return orderSetService.getOrderSetByNameCustomer(name,page);
    }

    //Para generar boleta de la orden de un cliente
    @Override
    public byte[] generateInvoice(UUID id_orderSet) throws JRException, NotFoundException {

        OrderSetWithListCustomerOrderDTO orderSetDTO = getOrderSetDTO(id_orderSet);

        //Lista productos
        List<DetalleBoleta> detalle = new ArrayList<>();

        for(CustomerOrderResponseDTO item : orderSetDTO.getOrders()){

            DetalleBoleta d = new DetalleBoleta();

            d.setProducto(item.getName_product());

            d.setPrecio(item.getTotal_rice() / item.getCount());

            d.setCantidad(String.valueOf(item.getCount()));

            double subtotal = item.getCount() * (item.getTotal_rice() / item.getCount());

            d.setSubtotal(Math.round(subtotal*100.0)/100.0);

            detalle.add(d);

        }

        //calculo de total sin dependencia
        double totalCalculado = orderSetDTO.getOrders().stream()
                .mapToDouble(item -> item.getCount() * (item.getTotal_rice() / item.getCount()) )
                .sum();

        // Parametros
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("cliente", orderSetDTO.getName_client());
        parameters.put("total", Math.round(totalCalculado*100.0)/100.0);

        //logo
        InputStream logoStream = getClass().getResourceAsStream("/restaurantLogo.jpg");
        parameters.put("logo", logoStream);

        // Convertir lista
        JRBeanCollectionDataSource tableDataSource = new JRBeanCollectionDataSource(detalle);
        parameters.put("DETALLES_DS", tableDataSource);

        //Cargar archivo .jasper compilado
        InputStream jasperStream = this.getClass().getResourceAsStream("/receipts/boleta_orden.jasper");
        if (jasperStream == null) {
            throw new JRException("No se encontró el archivo de reporte Jasper: boleta_orden.jasper");
        }
        JasperReport jasperReport = (JasperReport) JRLoader.loadObject(jasperStream);

        //llenar reporte
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());

        //Exportar a pdf
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

}
