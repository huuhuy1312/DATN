package com.example.order_service.repository;

import com.example.order_service.entity.Shipper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipperRepository extends JpaRepository<Shipper,Long> {

    @Query("SELECT s FROM Shipper s WHERE s.warehouse.id = :warehouseId AND s.isActive=true AND s.isDeleted=false")
    List<Shipper> findByWarehouseId(Long warehouseId);

    @Query("SELECT s FROM Shipper s WHERE s.warehouse.idAccount = :accountId AND s.isActive=true AND s.isDeleted=false")
    List<Shipper> findByAccountWarehouseId(Long accountId);
    @Query("SELECT s FROM Shipper s WHERE s.warehouse.idAccount = :warehouseIdAccount AND s.isActive=true AND s.isDeleted=false")
    List<Shipper> findByWarehouseIdAccount(Long warehouseIdAccount);
    @Query(value = "SELECT CONCAT('SHP', LPAD((CAST(SUBSTRING(MAX(code), 4) AS UNSIGNED) + 1), 5, '0')) AS new_code\n FROM shippers;",nativeQuery = true)
    String nextCode();

}
