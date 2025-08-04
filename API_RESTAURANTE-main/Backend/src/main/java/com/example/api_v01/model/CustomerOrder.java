package com.example.api_v01.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "customer_order")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CustomerOrder  {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_customer_order")
    private UUID id_order;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JoinColumn(
            name = "id_product",
            referencedColumnName = "id_product"
    )
    private Product product;

    private Integer count;

    private Double total_rice;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JoinColumn(
            name = "id_orde_set",
            referencedColumnName = "id_orde_set"
    )
    private OrderSet order;



}
