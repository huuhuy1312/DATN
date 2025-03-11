package com.example.order_service.repository;

import com.example.order_service.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse,Long> {

    @Query("SELECT w FROM Warehouse w WHERE w.idAccount IN :ids")
    List<Warehouse> findByAccountIds(List<Long> ids);
}
