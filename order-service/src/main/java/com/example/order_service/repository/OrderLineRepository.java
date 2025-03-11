package com.example.order_service.repository;

import com.example.order_service.entity.Order;
import com.example.order_service.entity.OrderLine;
import com.example.order_service.repository.custom.OrderLineRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface OrderLineRepository extends JpaRepository<OrderLine,Long>, OrderLineRepositoryCustom {
    List<OrderLine> findBySellerId(Long sellerId);

    @Query("SELECT ol FROM OrderLine ol ")
    List<OrderLine> getOrderLineNoCancel();
//    @Query("SELECT ol FROM OrderLine ol WHERE " +
//            "(:id IS NULL OR ol.id = :id) AND " +
//            "(:sellerId IS NULL OR ol.sellerId = :sellerId) AND " +
//            "(:status IS NULL OR (ol.status IS NOT NULL AND ol.status = :status)) AND " +
//            "(:shipperPickupDate IS NULL OR FUNCTION('DATE', ol.shipperPickupTime) = :shipperPickupDate) AND " +
//            "(:confirmDate IS NULL OR FUNCTION('DATE', ol.confirmTime) = :confirmDate) AND " +
//            "(:doneDate IS NULL OR FUNCTION('DATE', ol.doneTime) = :doneDate) AND " +
//            "(:paymentDate IS NULL OR FUNCTION('DATE', ol.paymentTime) = :paymentDate) AND " +
//            "(:idPickupShipper IS NULL OR (ol.pickupShipper IS NOT NULL AND ol.pickupShipper.idAccount = :idPickupShipper)) AND " +
//            "(:idPickupWarehouse IS NULL OR (ol.pickupWarehouse IS NOT NULL AND ol.pickupWarehouse.idAccount = :idPickupWarehouse)) AND " +
//            "(:idDeliveryWarehouse IS NULL OR (ol.deliveryWarehouse IS NOT NULL AND ol.deliveryWarehouse.idAccount = :idDeliveryWarehouse)) AND " +
//            "(:idDeliveryShipper IS NULL OR (ol.deliveryShipper IS NOT NULL AND ol.deliveryShipper.idAccount = :idDeliveryShipper))")
//    List<OrderLine> findByCondition(
//            @Param("id") Long id,
//            @Param("sellerId") Long sellerId,
//            @Param("status") String status,
//            @Param("shipperPickupDate") LocalDate shipperPickupDate,
//            @Param("confirmDate") LocalDate confirmDate,
//            @Param("doneDate") LocalDate doneDate,
//            @Param("paymentDate") LocalDate paymentDate,
//            @Param("idPickupShipper") Long idPickupShipper,
//            @Param("idPickupWarehouse") Long idPickupWarehouse,
//            @Param("idDeliveryWarehouse") Long idDeliveryWarehouse,
//            @Param("idDeliveryShipper") Long idDeliveryShipper
//    );


    @Modifying
    @Transactional
    @Query(value = "UPDATE order_lines o " +
            "SET o.pickup_shipper_id = CASE WHEN :idPickupShipper IS NOT NULL THEN :idPickupShipper ELSE o.pickup_shipper_id END, " +
            "o.pickup_warehouse_id = CASE WHEN :idPickupWarehouse IS NOT NULL THEN :idPickupWarehouse ELSE o.pickup_warehouse_id END, " +
            "o.delivery_shipper_id = CASE WHEN :idDeliveryShipper IS NOT NULL THEN :idDeliveryShipper ELSE o.delivery_shipper_id END " +
            "WHERE o.id = :id", nativeQuery = true)
    void updateOrderLine(@Param("idPickupShipper") Long idPickupShipper,
                        @Param("idPickupWarehouse") Long idPickupWarehouse,
                        @Param("idDeliveryShipper") Long idDeliveryShipper,
                        @Param("id") Long id);

    @Query("SELECT DISTINCT o.order.customerId FROM OrderLine o WHERE o.sellerId= :sellerId")
    List<Long> findCustomerBySellerId(@Param("sellerId") Long sellerId);


    @Query("SELECT ol FROM OrderLine ol " +
            "WHERE ol.pickupWarehouse.id = :idWH OR ol.deliveryWarehouse.id = :idWH")
    List<OrderLine> staticByIdWarehouse(@Param("idWH") Long idWH);



}
