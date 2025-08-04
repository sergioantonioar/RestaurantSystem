package com.example.api_v01.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "product_stock")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ProductStock {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_product_stock")
    private UUID id_product_stock;

    private Integer ini_stock;

    private Integer current_stock;

    private Integer total_sold;
}
