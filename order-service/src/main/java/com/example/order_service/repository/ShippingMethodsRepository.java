package com.example.order_service.repository;

import com.example.order_service.entity.ShippingMethods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ShippingMethodsRepository extends JpaRepository<ShippingMethods,Long> {
}
