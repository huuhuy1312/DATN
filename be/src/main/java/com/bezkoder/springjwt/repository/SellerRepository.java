package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.Seller;
import com.bezkoder.springjwt.payload.request.FilterSellerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller,Long> {
    @Query(value = "SELECT * FROM seller WHERE account_id=:account_id",nativeQuery = true)
    Seller findByAccountId(@Param(value = "account_id") Long account_id);

    @Query(value = "SELECT * FROM seller WHERE account_id IN :ids",nativeQuery = true)
    List<Seller> findByAccountIds(@Param(value = "ids") List<Long> ids);

    @Override
    @Query("SELECT s FROM Seller s WHERE s.isActive = true AND s.isDeleted = false")
    List<Seller> findAll();


    @Query("SELECT s FROM Seller s " +
            "WHERE (:#{#filter.id} IS NULL OR s.id = :#{#filter.id}) " +
            "AND (:#{#filter.isActive} IS NULL OR s.isActive = :#{#filter.isActive})" +
            "AND (:#{#filter.isDeleted} IS NULL OR s.isDeleted = :#{#filter.isDeleted})")
    List<Seller> findSellersByFilter(@Param("filter") FilterSellerRequest filter);


}
