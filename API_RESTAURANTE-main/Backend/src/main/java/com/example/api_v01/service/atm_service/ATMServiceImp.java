package com.example.api_v01.service.atm_service;

import com.example.api_v01.dto.entityLike.AtmDTO;
import com.example.api_v01.dto.response.AtmResponseDTO;
import com.example.api_v01.dto.response.RegisterAtmUserDTO;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.ATM;
import com.example.api_v01.model.Admin;
import com.example.api_v01.model.User;
import com.example.api_v01.model.enums.Rol;
import com.example.api_v01.repository.ATMRepository;
import com.example.api_v01.service.admin_service.AdminService;
import com.example.api_v01.service.user_service.UserService;
import com.example.api_v01.utils.ATMMovement;
import com.example.api_v01.utils.ExceptionMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ATMServiceImp implements ATMService, ExceptionMessage {

    private final ATMRepository atmRepository;
    private final AdminService adminService;
    private final PasswordEncoder passwordEncoder;

    @Value("${Entity-size}")
    private int size;

    @Override
    public AtmResponseDTO saveATM(UUID id_admin, AtmResponseDTO atm) throws NotFoundException { //Funciona Bien
        Admin admin = adminService.findById(id_admin);
        ATM savedATM = atmRepository.save(ATMMovement.saveATM(atm,admin));
        return ATMMovement.convertToResponseDTO(savedATM);
    }

    @Override
    public AtmResponseDTO assingUserATM(UUID id_atm, RegisterAtmUserDTO atm) throws NotFoundException, BadRequestException { //Funciona bien

        ATM atmOptional = atmRepository.findById(id_atm)
                .orElseThrow(() -> new NotFoundException(ExceptionMessage.ATM_NOT_FOUND));

        if(atmOptional.getUser_atm() != null) {
            throw new BadRequestException(user_find);
        }

        User user = User.builder()
                .role(Rol.ATM)
                .username(atm.getUsername())
                .password(passwordEncoder.encode(atm.getPassword()))
                .build();

        atmOptional.setUser_atm(user);
        atmOptional.setIs_active(true);
        ATM savedATM = atmRepository.save(atmOptional);

        return ATMMovement.convertToResponseDTO(savedATM); //transform
    }

    @Override
    public void deleteATM(UUID id_atm) throws NotFoundException { //Funciona bien
        Optional<ATM>ATMOptional = atmRepository.findById(id_atm);
        if(!ATMOptional.isPresent()){
            throw new NotFoundException(ATM_NOT_FOUND);
        }
        ATMOptional.get().setAdmin(null);
        atmRepository.delete(ATMOptional.get());
    }

    @Override
    public AtmResponseDTO updateATM(UUID id_atm, AtmResponseDTO atm) throws NotFoundException {
        Optional<ATM>ATMOptional = atmRepository.findById(id_atm);
        if (!ATMOptional.isPresent()) {
            throw new NotFoundException(ATM_NOT_FOUND);
        }
        ATM ATM = ATMMovement.validateATM(ATMOptional.get(), atm);
        ATM savedATM = atmRepository.save(ATM);
        return ATMMovement.convertToResponseDTO(savedATM);
    }

    @Override
    public AtmDTO getAtmById(UUID id_atm) throws NotFoundException {
        ATM atm = atmRepository.findById(id_atm)
                .orElseThrow(() -> new NotFoundException(ExceptionMessage.ATM_NOT_FOUND));
        return ATMMovement.convertToDTO(atm);
    }

    @Override
    public ATM getAtmEntityById(UUID id_atm) throws NotFoundException {
        return atmRepository.findById(id_atm)
                .orElseThrow(() -> new NotFoundException(ExceptionMessage.ATM_NOT_FOUND));
    }

    @Override
    public AtmDTO getAtmByName(String name) throws NotFoundException {
        ATM atm = atmRepository.findByNameAtm(name)
                .orElseThrow(() -> new NotFoundException(ExceptionMessage.ATM_NOT_FOUND));
        return ATMMovement.convertToDTO(atm);
    }

    @Override
    public AtmDTO getAtmByUser(UUID id_user) throws NotFoundException {
        ATM atm = atmRepository.findByIdUser(id_user)
                .orElseThrow(() -> new NotFoundException(ExceptionMessage.ATM_NOT_FOUND));
        return ATMMovement.convertToDTO(atm);
    }

    @Override
    public List<AtmDTO> getAllATMs(int page) {

        List<ATM> atms = atmRepository.findAll(
                PageRequest.of(page, size)
        ).getContent();

        return ATMMovement.convertToDTO(atms);

    }
}
