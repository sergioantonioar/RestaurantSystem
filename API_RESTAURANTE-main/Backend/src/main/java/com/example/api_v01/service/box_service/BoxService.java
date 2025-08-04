package com.example.api_v01.service.box_service;

import com.example.api_v01.dto.entityLike.BoxDTO;
import com.example.api_v01.dto.response.*;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.Box;

import java.util.List;
import java.util.UUID;

public interface BoxService {


    BoxResponseDTO saveBox(UUID id_admin, BoxNameDTO box) throws NotFoundException;

    BoxResponseWithArchingDTO toggleBoxActiveStatus (UUID id_box, ArchingInitDTO archingInitDTO) throws NotFoundException, BadRequestException;

    BoxWithArchingDTO toggleBoxDeactivationStatus (UUID id_box) throws NotFoundException, BadRequestException;

    BoxWithAtmDTO assignAtmToBox(UUID id_box, UUID id_atm) throws NotFoundException,BadRequestException;

    BoxDTO getBoxInfo(UUID boxId) throws NotFoundException;

    Box getBox(UUID boxId) throws NotFoundException;

    List<BoxDTO> getBoxes();

    List<BoxDTO> getBoxesByAtm(UUID id_atm) throws NotFoundException;
}
