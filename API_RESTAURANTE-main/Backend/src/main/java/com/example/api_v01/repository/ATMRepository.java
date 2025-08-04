package com.example.api_v01.repository;

import com.example.api_v01.model.ATM;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ATMRepository extends JpaRepository<ATM, UUID> {

    // Metodo para buscar el ATM por nombre, alias o dni

    @Query("SELECT a FROM ATM a WHERE a.name_atm=?1")
    Optional<ATM> findByNameAtm(String nameAtm);


    @Query("SELECT a FROM ATM a WHERE a.user_atm.id_user=?1")
    Optional<ATM> findByIdUser(UUID id_user);
}
