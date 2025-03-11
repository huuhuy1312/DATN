package com.example.product_service.repository;


import com.example.product_service.entity.Rate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RateRepository extends JpaRepository<Rate,Long> {
    @Query("SELECT r FROM Rate r WHERE r.typeOfProduct.product.id=:idProduct")
    List<Rate> findByProductId(Long idProduct);
}
