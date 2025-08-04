package com.example.api_v01.repository;

import com.example.api_v01.model.OrderSet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderSetRepository extends JpaRepository<OrderSet, UUID> {

    @Query("SELECT o FROM OrderSet o WHERE o.name_client=?1")
    Page<OrderSet> findByNameClient(String name_client,Pageable pageable);

    @Query("SELECT o FROM OrderSet o WHERE o.arching.id_arching=?1 ")
    Page<OrderSet> findByArching(UUID id_arching,Pageable pageable);

    @Query("SELECT o FROM OrderSet o WHERE o.arching.id_arching=?1 ")
    List<OrderSet> findByArchingMountTotal(UUID id_arching);
}
