package com.example.api_v01.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "box")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Box {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_box")
    private UUID id_box;

    @Column(nullable = false)
    private String name_box;

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @Column(nullable = true)
    private UUID id_Arching_aux;

    @Column
    @Builder.Default
    private Boolean is_open = false;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "id_atm" ,referencedColumnName = "id_atm")
    private ATM atm;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "id_admin",referencedColumnName = "id_admin")
    private Admin admin;
}
