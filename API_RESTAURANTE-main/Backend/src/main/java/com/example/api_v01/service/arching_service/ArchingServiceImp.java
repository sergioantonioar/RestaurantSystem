package com.example.api_v01.service.arching_service;

import com.example.api_v01.dto.entityLike.ArchingDTO;
import com.example.api_v01.dto.response.ArchingInitDTO;
import com.example.api_v01.dto.response.ArchingResponseDTO;
import com.example.api_v01.dto.response.ArchingWithAtmDTO;
import com.example.api_v01.dto.response.ArchingWithBoxDTO;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.Arching;
import com.example.api_v01.model.Box;
import com.example.api_v01.repository.ArchingRepository;
import com.example.api_v01.repository.BoxRepository;
import com.example.api_v01.service.box_service.BoxService;
import com.example.api_v01.service.order_set_service.OrderSetService;
import com.example.api_v01.utils.ArchingMovement;
import com.example.api_v01.utils.ExceptionMessage;
import com.example.api_v01.utils.Tuple;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ArchingServiceImp implements ArchingService, ExceptionMessage {

    private final ArchingRepository archingRepository;

    private final BoxRepository boxRepository;

    @Value("${Entity-size}")
    private int size;

    //Se usa en un servicio auxiliar para la logica no borrar
    @Override
    public Arching saveArching(Arching arching) {
        return archingRepository.save(arching);
    }

    //Lo utiliza otro servicio,!!! NO BORRAR
    @Override
    public Arching getArchingById(UUID id_arching) throws NotFoundException {
        return archingRepository.findById(id_arching)
                .orElseThrow(()-> new NotFoundException(ARCHING_NOT_FOUND));
    }






    //Servicio para guardar el arqueo
    @Override
    public Tuple<ArchingResponseDTO,UUID> saveArchingResponseDTO(UUID id_box, ArchingInitDTO archingInitDTO) throws NotFoundException, BadRequestException {
        Box box = boxRepository.findById(id_box).orElseThrow(()-> new NotFoundException(BOX_NOT_FOUND));
        if(!box.getIs_open()){
            throw new BadRequestException("La caja debe estar abierta antes de asignarle un arqueo");
        }
        Arching arching = archingRepository.save(ArchingMovement.CreateArchingInit(box,archingInitDTO)) ;
        return new Tuple<>(ArchingMovement.CreateArchingResponseDTO(arching),arching.getId_arching());
    }





    //Me trae todos los arqueos
    @Override
    public List<ArchingDTO> getAllArching(int page) {
        return ArchingMovement.CreateListArchingDTO(
                archingRepository.findAll(
                        PageRequest.of(page,size)
                ).getContent()
        );
    }

    //Me traen el arqueo por su id
    @Override
    public ArchingDTO getArchingDTOById(UUID id_arching) throws NotFoundException {
        return ArchingMovement
                .TransformArchingDTO(
                        archingRepository.findById(id_arching)
                                .orElseThrow( () -> new NotFoundException(ExceptionMessage.ARCHING_NOT_FOUND) )
                );
    }

    //Me traer todos los arqueos por el id del ATM
    @Override
    public List<ArchingWithAtmDTO> getArchingByATM(UUID id_atm,int page) throws NotFoundException {
        List<Arching>archingList=archingRepository
                .findArchingByIdAtm(
                        id_atm,
                        PageRequest.of(page,size)
                ).getContent();
        return ArchingMovement.CreateListArchingWithAtmDTO(archingList);
    }

    //Me traer todos los arqueos por el nombre del ATM
    @Override
    public List<ArchingWithAtmDTO> getArchingByNameATM(String name_ATM,int page) throws NotFoundException {
        List<Arching>archingList=archingRepository.findArchingByNameAtm(
                name_ATM,
                PageRequest.of(page,size)
        ).getContent();
        return ArchingMovement.CreateListArchingWithAtmDTO(archingList);
    }

    //Me traer todos los arqueos por el id del box
    @Override
    public List<ArchingWithBoxDTO> getArchingByBox(UUID id_box,int page) throws NotFoundException {
        List<Arching>archingList=archingRepository.findArchingByIdBox(
                id_box,
                PageRequest.of(page,size)
        ).getContent();
        return ArchingMovement.CreateListArchingWithBoxDTO(archingList);
    }

    //Me traer todos los arqueos por el nombre del box
    @Override
    public List<ArchingWithBoxDTO> getArchingByNameBox(String name_BOX,int page) throws NotFoundException {
        List<Arching>archingList=archingRepository.findArchingByNameBox(
                name_BOX,
                PageRequest.of(page,size)
        ).getContent();
        return ArchingMovement.CreateListArchingWithBoxDTO(archingList);
    }

    public byte[] generateSummaryReceipt(UUID id_arching) throws NotFoundException {
        try {
            ArchingDTO arching = getArchingDTOById(id_arching);

            System.out.println("Prueba 1");

            //Formato
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

            //Datos
            String nombreCaja = arching.getArching_with_box_and_atm().getBoxDTO().getName_box();
            String nombreCajero = arching.getArching_with_box_and_atm().getAtmDTO().getName_atm();
            String fechaApertura = arching.getDate().atTime(arching.getStar_time()).format(formatter);
            String fechaConsulta = LocalDateTime.now().format(formatter);

            Double montoInicial = arching.getInit_amount();
            Double montoTotal = arching.getTotal_amount();
            Double montoFinal = arching.getFinal_amount();
            montoFinal = Optional.ofNullable(montoFinal).orElse(0.0); //Aun no cerraria caja

            System.out.println("Prueba 2");

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("caja", nombreCaja);
            parameters.put("cajero", nombreCajero);
            parameters.put("fecha_apertura", fechaApertura);
            parameters.put("fecha_consulta", fechaConsulta);
            parameters.put("monto_inicial", montoInicial);
            parameters.put("monto_total", montoTotal);
            parameters.put("monto_final", montoFinal);

            System.out.println("Prueba 3");

            InputStream reportStream = Thread.currentThread().getContextClassLoader()
                    .getResourceAsStream("receipts/resumen_arqueo.jasper");

            if (reportStream == null) {
                System.err.println("⚠️ Archivo resumen_arqueo.jasper no encontrado.");
                throw new JRException("Archivo .jasper no encontrado en classpath.");
            }

            JasperPrint jasperPrint = JasperFillManager.fillReport(reportStream, parameters, new JREmptyDataSource());

            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            // Ver el error real en consola
            System.err.println("❌ Error generando el PDF: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error interno al generar el PDF: " + e.getMessage());
        }
    }



}
