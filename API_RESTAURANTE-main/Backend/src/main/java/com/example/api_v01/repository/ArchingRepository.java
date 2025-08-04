package com.example.api_v01.repository;

import com.example.api_v01.model.Arching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ArchingRepository extends JpaRepository<Arching, UUID> {

    @Query("SELECT a FROM Arching a WHERE a.box.id_box=?1")
    Page<Arching> findArchingByIdBox(UUID id_box,Pageable pageable);

    @Query("SELECT a FROM Arching a WHERE a.box.name_box=?1")
    Page<Arching>findArchingByNameBox(String name_box,Pageable pageable);

    @Query("SELECT a FROM Arching a WHERE a.box.atm.id_atm=?1")
    Page<Arching> findArchingByIdAtm(UUID id_atm,Pageable pageable);

    @Query("SELECT a FROM Arching a WHERE a.box.atm.name_atm=?1")
    Page<Arching> findArchingByNameAtm(String name_atm,Pageable pageable);
}
