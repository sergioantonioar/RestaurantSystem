package com.example.api_v01.service.service_aux;

import com.example.api_v01.dto.response.ArchingInitDTO;
import com.example.api_v01.dto.response.ArchingResponseDTO;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.utils.Tuple;

import java.util.UUID;

public interface ArchingProcessOrderSet {
    ArchingResponseDTO closeArching(UUID id_arching) throws NotFoundException;
    Tuple<ArchingResponseDTO,UUID> saveArchingResponseDTO(UUID id_box, ArchingInitDTO archingInitDTO) throws NotFoundException, BadRequestException;
}
