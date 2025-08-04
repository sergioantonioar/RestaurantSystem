package com.example.api_v01.utils;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

public class UriGeneric {
    public static URI GenereURI(String Ruta_GetById_Entity,UUID IdEntity) {
        return ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path(Ruta_GetById_Entity)
                .buildAndExpand(IdEntity)
                .toUri();
    }
}
