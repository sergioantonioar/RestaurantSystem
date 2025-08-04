package com.example.api_v01.utils;

import com.example.api_v01.dto.entityLike.ArchingDTO;
import com.example.api_v01.dto.entityLike.AtmDTO;
import com.example.api_v01.dto.entityLike.BoxDTO;
import com.example.api_v01.dto.response.*;
import com.example.api_v01.model.Arching;
import com.example.api_v01.model.Box;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class ArchingMovement {
    public static Arching CreateArchingInit(Box box, ArchingInitDTO archingInitDTO) {
        return Arching.builder()
                .date(LocalDate.now())
                .star_time(LocalTime.now())
                .init_amount(archingInitDTO.getInit_amount())
                .box(box)
                .build();
    }

    public static ArchingResponseDTO CreateArchingResponseDTOClose(Arching arching) {
        return ArchingResponseDTO.builder()
                .date(arching.getDate())
                .star_time(arching.getStar_time())
                .end_time(arching.getEnd_time())
                .init_amount(arching.getInit_amount())
                .final_amount(arching.getFinal_amount())
                .total_amount(arching.getTotal_amount())
                .box(
                        BoxResponseDTO.builder()
                                .name_box(arching.getBox().getName_box())
                                .is_open(arching.getBox().getIs_open())
                                .build()
                )
                .build();
    }

    public static ArchingResponseDTO CreateArchingResponseDTO(Arching arching) {
        return ArchingResponseDTO.builder()
                .date(arching.getDate())
                .star_time(arching.getStar_time())
                .init_amount(arching.getInit_amount())
                .box(
                        BoxResponseDTO.builder()
                                .name_box(arching.getBox().getName_box())
                                .is_open(arching.getBox().getIs_open())
                                .build()
                )
                .build();
    }

    public static Arching CloseArchingBox(Arching arching,Double Final_amount) {
        arching.setEnd_time(LocalTime.now());
        arching.setFinal_amount(Final_amount);
        arching.setTotal_amount( arching.getInit_amount() + Final_amount );
        return arching;
    }

    public static ArchingWithAtmDTO TransformArchingWithAtmDTO(Arching arching) {
        return ArchingWithAtmDTO.builder()
                .id_arching(arching.getId_arching())
                .date(arching.getDate())
                .star_time(arching.getStar_time())
                .end_time(arching.getEnd_time())
                .init_amount(arching.getInit_amount())
                .final_amount(arching.getFinal_amount())
                .total_amount(arching.getTotal_amount())
                .atm(
                        AtmDTO.builder()
                                .id_atm(arching.getBox().getAtm().getId_atm())
                                .name_atm(arching.getBox().getAtm().getName_atm())
                                .alias(arching.getBox().getAtm().getAlias())
                                .email(arching.getBox().getAtm().getEmail())
                                .phone(arching.getBox().getAtm().getPhone())
                                .dni(arching.getBox().getAtm().getDni())
                                .build()
                )
                .build();
    }

    public static List<ArchingWithAtmDTO> CreateListArchingWithAtmDTO(List<Arching>ListArching) {
        return ListArching.stream()
                .map(ArchingMovement::TransformArchingWithAtmDTO)
                .toList();
    }

    public static ArchingWithBoxDTO TransformArchingWithBoxDTO(Arching arching) {
        return ArchingWithBoxDTO.builder()
                .id_arching(arching.getId_arching())
                .date(arching.getDate())
                .star_time(arching.getStar_time())
                .end_time(arching.getEnd_time())
                .init_amount(arching.getInit_amount())
                .final_amount(arching.getFinal_amount())
                .total_amount(arching.getTotal_amount())
                .box(
                        BoxDTO.builder()
                                .id_box(arching.getBox().getId_box())
                                .name_box(arching.getBox().getName_box())
                                .date(arching.getBox().getDate())
                                .is_open(arching.getBox().getIs_open())
                                .build()
                )
                .build();
    }

    public static List<ArchingWithBoxDTO> CreateListArchingWithBoxDTO(List<Arching>ListArching) {
        return ListArching.stream()
                .map(ArchingMovement::TransformArchingWithBoxDTO)
                .toList();
    }

    public static List<ArchingDTO> CreateListArchingDTO(List<Arching>ListArching) {
        return ListArching.stream()
                .map(ArchingMovement::TransformArchingDTO)
                .toList();
    }

    public static ArchingDTO TransformArchingDTO(Arching arching) {
        return ArchingDTO.builder()
                .id_arching(arching.getId_arching())
                .date(arching.getDate())
                .star_time(arching.getStar_time())
                .end_time(arching.getEnd_time())
                .init_amount(arching.getInit_amount())
                .final_amount(arching.getFinal_amount())
                .total_amount(arching.getTotal_amount())
                .arching_with_box_and_atm(
                        ArchingWithBoxAndAtmDTO.builder()
                                .boxDTO(
                                        BoxDTO.builder()
                                                .id_box(arching.getBox().getId_box())
                                                .name_box(arching.getBox().getName_box())
                                                .date(arching.getBox().getDate())
                                                .is_open(arching.getBox().getIs_open())
                                                .build()
                                )
                                .atmDTO(
                                        AtmDTO.builder()
                                                .id_atm(arching.getBox().getAtm().getId_atm())
                                                .name_atm(arching.getBox().getAtm().getName_atm())
                                                .alias(arching.getBox().getAtm().getAlias())
                                                .email(arching.getBox().getAtm().getEmail())
                                                .phone(arching.getBox().getAtm().getPhone())
                                                .dni(arching.getBox().getAtm().getDni())
                                                .build()
                                )
                                .build()
                )
                .build();
    }
}
