package com.example.api_v01.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "order_set")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderSet {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_orde_set")
    private UUID id_order_set;

    @Column(nullable = false)
    private String name_client;

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date_order;

    @Column(nullable = false)
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime time_order;

    @Column(nullable = true)
    private Double total_order;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE ,CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "id_arching",referencedColumnName = "id_arching")
    private Arching arching;

    @Builder.Default
    private Boolean active = false;

    @Builder.Default
    private Boolean dispatch = false;

}
