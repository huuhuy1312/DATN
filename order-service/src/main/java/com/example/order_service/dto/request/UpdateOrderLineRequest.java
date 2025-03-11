package com.example.order_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderLineRequest {
    private Long id;
    private String reasonCancel;
    private String status;
    private String waybillCode;
    private LocalDateTime shipperPickupTime;
    private LocalDateTime confirmTime;
    private LocalDateTime doneTime;
    private LocalDateTime paymentTime;
    private LocalDate sellerPickupRequestDate;
    private LocalDateTime deliveryWarehouseReceiveTime;
    private LocalDateTime shipperDeliveryTime;
    private Long idPickupShipper;
    private Long idPickupWarehouse;
    private Long idDeliveryShipper;
    private Long idDeliveryWarehouse;
}
