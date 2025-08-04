package com.example.api_v01.utils;

import com.example.api_v01.dto.entityLike.AtmDTO;
import com.example.api_v01.dto.entityLike.BoxDTO;
import com.example.api_v01.dto.response.*;
import com.example.api_v01.model.Admin;
import com.example.api_v01.model.Box;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class BoxMovement {
    public static List<BoxDTO>CreateListBoxDTO(List<Box> boxes){
        return boxes.stream()
                .map(BoxMovement::CreateBoxDTO)
                .toList();
    }
    public static BoxDTO CreateBoxDTO(Box box) {
        return BoxDTO.builder()
                .id_box(box.getId_box())
                .name_box(box.getName_box())
                .date(box.getDate())
                .is_open(box.getIs_open())
                .build();
    }
    public static Box CreateBox(Admin admin, BoxNameDTO boxDTO) {
        return Box.builder()
                .name_box(boxDTO.getName_box())
                .date(LocalDate.now())
                .admin(admin)
                .build();
    }
    public static BoxResponseDTO CreateBoxResponseDTO(Box box) {
        return BoxResponseDTO.builder()
                .name_box(box.getName_box())
                .is_open(box.getIs_open())
                .build();
    }


    public static BoxResponseWithArchingDTO CreateBoxResponseDTO(Box box, UUID id_arching) {
        return BoxResponseWithArchingDTO.builder()
                .name_box(box.getName_box())
                .is_open(box.getIs_open())
                .id_arching(id_arching)
                .build();
    }

    public static BoxWithArchingDTO CreateBoxWithArchingDTO(Box box, ArchingResponseDTO archingResponseDTO) {
        return BoxWithArchingDTO.builder()
                .box_name(box.getName_box())
                .is_open(box.getIs_open())
                .arching(
                        ArchingTwoDTO.builder()
                                .date(archingResponseDTO.getDate())
                                .star_time(archingResponseDTO.getStar_time())
                                .end_time(archingResponseDTO.getEnd_time())
                                .init_amount(archingResponseDTO.getInit_amount())
                                .final_amount(archingResponseDTO.getFinal_amount())
                                .total_amount(archingResponseDTO.getTotal_amount())
                                .build()
                )
                .build();
    }


    public static BoxWithAtmDTO BoxAndATM(Box box) {
        return BoxWithAtmDTO.builder()
                .name_box(box.getName_box())
                .atm(
                        AtmDTO.builder()
                                .id_atm(box.getAtm().getId_atm())
                                .name_atm(box.getAtm().getName_atm())
                                .alias(box.getAtm().getAlias())
                                .phone(box.getAtm().getPhone())
                                .dni(box.getAtm().getDni())
                                .email(box.getAtm().getDni())
                                .build()
                )
                .build();
    }
}
