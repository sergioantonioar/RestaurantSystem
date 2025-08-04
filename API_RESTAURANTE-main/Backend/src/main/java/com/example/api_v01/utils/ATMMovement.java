package com.example.api_v01.utils;

import com.example.api_v01.dto.entityLike.AtmDTO;
import com.example.api_v01.dto.response.AtmResponseDTO;
import com.example.api_v01.dto.response.RegisterAtmUserDTO;
import com.example.api_v01.model.ATM;
import com.example.api_v01.model.Admin;
import com.example.api_v01.model.User;
import com.example.api_v01.model.enums.Rol;

import java.time.LocalDate;
import java.util.List;


public class ATMMovement {

    public static ATM saveATM(AtmResponseDTO atm, Admin admin)  {
        return ATM.builder()
                .name_atm(atm.getName_atm())
                .date(LocalDate.now())
                .alias(atm.getAlias())
                .email(atm.getEmail())
                .phone(atm.getPhone())
                .dni(atm.getDni())
                .admin(admin)
                .build();
    }

    public static ATM validateATM(ATM atm,AtmResponseDTO atmDTO) {
        if(atmDTO.getName_atm() != null){
            atm.setName_atm(atmDTO.getName_atm());
        }
        if(atmDTO.getAlias() != null){
            atm.setAlias(atmDTO.getAlias());
        }
        if(atmDTO.getEmail() != null){
            atm.setEmail(atmDTO.getEmail());
        }
        if(atmDTO.getPhone() != null){
            atm.setPhone(atmDTO.getPhone());
        }
        if(atmDTO.getDni() != null){
            atm.setDni(atmDTO.getDni());
        }
        return atm;
    }

    public static AtmResponseDTO convertToResponseDTO(ATM atm){
        return AtmResponseDTO.builder()
                .name_atm(atm.getName_atm())
                .alias(atm.getAlias())
                .email(atm.getEmail())
                .phone(atm.getPhone())
                .dni(atm.getDni())
                .build();
    }

    public static AtmDTO convertToDTO(ATM atm){
        return AtmDTO.builder()
                .id_atm(atm.getId_atm())
                .name_atm(atm.getName_atm())
                .alias(atm.getAlias())
                .email(atm.getEmail())
                .phone(atm.getPhone())
                .dni(atm.getDni())
                .is_active(atm.getIs_active())
                .build();
    }

    public static ATM convertDTOToATM(AtmDTO atmDTO) {
        return ATM.builder()
                .id_atm(atmDTO.getId_atm()) // Mapea los campos relevantes
                .name_atm(atmDTO.getName_atm())
                .alias(atmDTO.getAlias())
                .email(atmDTO.getEmail())
                .phone(atmDTO.getPhone())
                .dni(atmDTO.getDni())
                .build();
    }

    public static List<AtmDTO> convertToDTO(List<ATM> atms){
        return atms.stream()
                .map(ATMMovement::convertToDTO)
                .toList();
    }

}
