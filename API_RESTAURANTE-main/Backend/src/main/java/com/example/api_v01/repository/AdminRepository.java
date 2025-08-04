package com.example.api_v01.repository;

import com.example.api_v01.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminRepository extends JpaRepository<Admin, UUID> {
    @Query("SELECT a FROM Admin a WHERE a.user_admin.id_user=?1")
    Optional<Admin> findByUserID(UUID id);
}
