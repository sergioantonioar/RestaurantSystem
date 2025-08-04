package com.example.api_v01.service.service_aux;

import com.example.api_v01.dto.response.ArchingInitDTO;
import com.example.api_v01.dto.response.ArchingResponseDTO;
import com.example.api_v01.handler.BadRequestException;
import com.example.api_v01.handler.NotFoundException;
import com.example.api_v01.model.Arching;
import com.example.api_v01.service.arching_service.ArchingService;
import com.example.api_v01.service.order_set_service.OrderSetService;
import com.example.api_v01.utils.ArchingMovement;
import com.example.api_v01.utils.Tuple;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArchingProcessOrderSetImp implements ArchingProcessOrderSet {

    private final ArchingService archingService;

    private final OrderSetService orderSetService;

    //Si para que al momento de cerrar la caja el arqueo obtega el valor final y total
    @Override
    public ArchingResponseDTO closeArching(UUID id_arching) throws NotFoundException{
        Arching arching = archingService.getArchingById(id_arching);
        Double Mount_Final=orderSetService.totalAmountArching(id_arching);
        arching = archingService.saveArching(ArchingMovement.CloseArchingBox(arching, Mount_Final));
        return ArchingMovement.CreateArchingResponseDTOClose(arching);
    }

    @Override
    public Tuple<ArchingResponseDTO, UUID> saveArchingResponseDTO(UUID id_box, ArchingInitDTO archingInitDTO) throws NotFoundException, BadRequestException {
        return archingService.saveArchingResponseDTO(id_box, archingInitDTO);
    }

}
