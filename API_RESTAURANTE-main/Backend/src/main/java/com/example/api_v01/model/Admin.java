package com.example.api_v01.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "admin")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_admin")
    private UUID id_admin;

    @Column(nullable = false)
    private String name_admin;

    @Column(nullable = false)
    private String email_admin;

    @Column(nullable = false)
    private String dni_admin;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "id_user" , referencedColumnName = "id_user")
    private User user_admin;

}
