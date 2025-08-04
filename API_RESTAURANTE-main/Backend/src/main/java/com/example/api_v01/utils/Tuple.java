package com.example.api_v01.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;


@Data
@RequiredArgsConstructor
public class Tuple<A,B>{
    private final A first;
    private final B second;
}
