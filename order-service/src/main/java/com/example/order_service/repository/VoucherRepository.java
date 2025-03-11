package com.example.order_service.repository;

import com.example.order_service.dto.response.VoucherResponse;
import com.example.order_service.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher,Long> {

    @Query("SELECT v FROM Voucher v WHERE v.isActive = true AND v.endDate > :currentDate AND v.startDate < :currentDate")
    Page<Voucher> findActiveVouchers(LocalDateTime currentDate, Pageable pageable);

    @Query("SELECT new com.example.order_service.dto.response.VoucherResponse(v.id, v.type,v.code,v.reduceMaxAmount,v.conditionAmount,v.percentReduce,v.startDate,v.endDate,v.maxQuantity,v.isActive)  " +
            "FROM Voucher v WHERE v.isActive = true AND v.endDate > :currentDate AND v.startDate< :currentDate AND v.type = 'Giảm tiền hàng' AND (v.maxQuantity>0 OR v.maxQuantity IS NULL)")
    List<VoucherResponse> findAllActiveDiscountVoucher(LocalDateTime currentDate);


    @Query("SELECT new com.example.order_service.dto.response.VoucherResponse(v.id, v.type,v.code,v.reduceMaxAmount,v.conditionAmount,v.percentReduce,v.startDate,v.endDate,v.maxQuantity,v.isActive)  " +
            "FROM Voucher v WHERE v.isActive = true AND v.endDate > :currentDate AND v.startDate< :currentDate AND v.type = 'Giảm tiền ship' AND (v.maxQuantity>0 OR v.maxQuantity IS NULL)")
    List<VoucherResponse> findAllActiveShippingVoucher(LocalDateTime currentDate);
}
