package com.example.api_v01.repository;

import com.example.api_v01.model.Box;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BoxRepository extends JpaRepository<Box, UUID> {

    @Query("SELECT b FROM Box b where b.atm.id_atm=?1")
    List<Box>BoxByATM(UUID id_atm);

}
