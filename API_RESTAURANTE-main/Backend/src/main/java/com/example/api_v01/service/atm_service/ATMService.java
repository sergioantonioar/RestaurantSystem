package com.example.api_v01.service.atm_service;

import com.example.api_v01.dto.entityLike.AtmDTO;
import com.example.api_v01.dto.response.AtmResponseDTO;
import com.example.api_v01.dto.response.RegisterAtmUserDTO;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.ATM;

import java.util.List;
import java.util.UUID;

public interface ATMService {
    AtmResponseDTO saveATM(UUID id_admin, AtmResponseDTO atm) throws NotFoundException;
    AtmResponseDTO assingUserATM(UUID id_atm, RegisterAtmUserDTO atm) throws NotFoundException;
    AtmResponseDTO updateATM(UUID id_atm,AtmResponseDTO atm) throws NotFoundException;
    void deleteATM(UUID id_atm) throws NotFoundException;
    AtmDTO getAtmById(UUID id_atm) throws NotFoundException;
    ATM getAtmEntityById(UUID id_atm) throws NotFoundException;
    AtmDTO getAtmByName(String name) throws NotFoundException;
    AtmDTO getAtmByUser(UUID id_user) throws NotFoundException;
    List<AtmDTO> getAllATMs(int page);
}
