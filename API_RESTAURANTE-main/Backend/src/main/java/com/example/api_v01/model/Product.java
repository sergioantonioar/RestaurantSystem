package com.example.api_v01.model;

import com.example.api_v01.model.enums.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "product")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_product")
    private UUID id_Product;

    private String name_product;

    private Double price;

    private String additional_observation;

    @Enumerated(EnumType.STRING)
    private Category category;

    @OneToOne(
            cascade = {CascadeType.ALL},
            fetch = FetchType.EAGER
    )
    @JoinColumn(
            name = "id_product_stock",
            referencedColumnName = "id_product_stock"
    )
    private ProductStock stock;

    @ManyToOne(
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "id_admin",
            referencedColumnName = "id_admin"
    )
    private Admin admin;
}
