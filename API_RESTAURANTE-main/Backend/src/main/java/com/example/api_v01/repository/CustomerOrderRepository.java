package com.example.api_v01.repository;

import com.example.api_v01.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, UUID> {
    @Query("SELECT c FROM CustomerOrder c WHERE c.order.id_order_set=?1")
    List<CustomerOrder> findByOrderSetId(UUID orderSetId);
}
