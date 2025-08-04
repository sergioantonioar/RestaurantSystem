package com.example.api_v01.service.sugerencia_service;

import com.example.api_v01.model.Sugerencia;
import com.example.api_v01.repository.SugerenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SugerenciaService {

    private final SugerenciaRepository sugerenciaRepository;

    public Sugerencia guardarSugerencia(Sugerencia sugerencia) {
        return sugerenciaRepository.save(sugerencia);
    }
}
