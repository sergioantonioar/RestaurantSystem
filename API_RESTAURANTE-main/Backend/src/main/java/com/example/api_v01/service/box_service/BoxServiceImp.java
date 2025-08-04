package com.example.api_v01.service.box_service;

import com.example.api_v01.dto.entityLike.BoxDTO;
import com.example.api_v01.dto.response.*;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.ATM;
import com.example.api_v01.model.Admin;
import com.example.api_v01.model.Box;
import com.example.api_v01.repository.BoxRepository;
import com.example.api_v01.service.admin_service.AdminService;

import com.example.api_v01.service.atm_service.ATMService;
import com.example.api_v01.service.service_aux.ArchingProcessOrderSet;
import com.example.api_v01.utils.BoxMovement;
import com.example.api_v01.utils.ExceptionMessage;
import com.example.api_v01.utils.Tuple;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BoxServiceImp implements BoxService, ExceptionMessage {

    private final BoxRepository boxRepository;
    private final ATMService atmService;
    private final AdminService adminService;

    private final ArchingProcessOrderSet archingProcessOrderSet;

    @Override
    public BoxResponseDTO saveBox(UUID id_admin, BoxNameDTO box) throws NotFoundException {
        Admin admin = adminService.findById(id_admin);
        Box newBox = boxRepository.save(BoxMovement.CreateBox(admin,box));
        return BoxMovement.CreateBoxResponseDTO(newBox);
    }

    @Override
    public BoxResponseWithArchingDTO toggleBoxActiveStatus(UUID id_box, ArchingInitDTO archingInitDTO) throws NotFoundException, BadRequestException {

        Box box = boxRepository.findById(id_box)
                .orElseThrow( () -> new NotFoundException(BOX_NOT_FOUND));

        if(box.getIs_open() == true) {
            throw new BadRequestException(BOX_OPEN);
        }

        box.setIs_open(true);

        boxRepository.save(box);

        Tuple <ArchingResponseDTO,UUID> tuple = archingProcessOrderSet.saveArchingResponseDTO(id_box,archingInitDTO);

        if(box.getId_Arching_aux() != null){
            throw new BadRequestException(ARCHING_ERROR);
        }

        box.setId_Arching_aux(tuple.getSecond());

        boxRepository.save(box);

        return BoxMovement.CreateBoxResponseDTO(box,tuple.getSecond());

    }

    @Override
    public BoxWithArchingDTO toggleBoxDeactivationStatus(UUID id_box) throws NotFoundException, BadRequestException {

        Box box = boxRepository.findById(id_box)
                .orElseThrow( () -> new NotFoundException(BOX_NOT_FOUND));

        if(box.getIs_open() == false) {
            throw new BadRequestException(BOX_CLOSE);
        }

        box.setIs_open(false);

        ArchingResponseDTO archingResponseDTO = archingProcessOrderSet.closeArching(box.getId_Arching_aux());

        box.setId_Arching_aux(null);

        box = boxRepository.save(box);

        return BoxMovement.CreateBoxWithArchingDTO(box,archingResponseDTO);
    }

    @Override
    public BoxWithAtmDTO assignAtmToBox(UUID id_box, UUID id_atm) throws NotFoundException,BadRequestException {

        ATM atm = atmService.getAtmEntityById(id_atm);

        if(atm.getUser_atm()==null){
            throw new BadRequestException("El atm necesita un user para ser asignado a una caja");
        }

        Box box = boxRepository.findById(id_box)
                .orElseThrow( () -> new NotFoundException(BOX_NOT_FOUND));

        box.setAtm(atm);

        box = boxRepository.save(box);

        return BoxMovement.BoxAndATM(box);
    }

    @Override
    public BoxDTO getBoxInfo(UUID boxId) throws NotFoundException {
        Box box = boxRepository.findById(boxId)
                .orElseThrow( () -> new NotFoundException(BOX_NOT_FOUND));
        return BoxMovement.CreateBoxDTO(box);
    }

    //Esto lo usar el servicio ArchingServiceImp NO BORRAR
    @Override
    public Box getBox(UUID boxId) throws NotFoundException {
        return boxRepository.findById(boxId)
                .orElseThrow( () -> new NotFoundException(BOX_NOT_FOUND));
    }

    @Override
    public List<BoxDTO> getBoxes() {
        return BoxMovement.CreateListBoxDTO(boxRepository.findAll());
    }

    @Override
    public List<BoxDTO> getBoxesByAtm(UUID id_atm) {
        return BoxMovement.CreateListBoxDTO(boxRepository.BoxByATM(id_atm));
    }
}
