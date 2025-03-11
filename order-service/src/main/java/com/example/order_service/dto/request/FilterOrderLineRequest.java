package com.example.order_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilterOrderLineRequest {
    private Long id;
    private String code;
    private LocalDateTime fromCreatedAt;
    private LocalDateTime toCreatedAt;
    private Long sellerId;
    private Long customerId;
    private String status;
    private LocalDate shipperPickupDate;
    private LocalDate confirmDate;
    private LocalDate doneDate;
    private LocalDate paymentDate;
    private Long idPickupShipper;
    private Long idPickupWarehouse;
    private Long idDeliveryWarehouse;
    private Long idDeliveryShipper;
    private List<String> listStatus;
}
