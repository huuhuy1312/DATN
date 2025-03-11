package com.example.order_service.repository;

import com.example.order_service.dto.request.FilterOrderRequest;
import com.example.order_service.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
    @Query("SELECT o FROM Order o " +
            "WHERE (:#{#filter.id} IS NULL OR o.id = :#{#filter.id}) " +
            "AND (:#{#filter.customerId} IS NULL OR o.customerId = :#{#filter.customerId}) " +
            "AND (:#{#filter.status} IS NULL OR o.status = :#{#filter.status}) ")
    List<Order> findOrders(@Param("filter") FilterOrderRequest filter);





    @Query("SELECT DISTINCT o FROM Order o " +
            "JOIN o.orderLineList ol " +
            "WHERE ol.sellerId = :idSeller OR ol.sellerId = :idSeller")
    List<Order> staticByIdSeller(@Param("idSeller") Long idSeller);
}
