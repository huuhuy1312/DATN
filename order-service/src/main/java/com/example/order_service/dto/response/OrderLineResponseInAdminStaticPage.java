package com.example.order_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderLineResponseInAdminStaticPage {
    public Long id;
    public Long totalPrice;
    public Long idDeliveryWarehouse;
    public Long idPickupWarehouse;
    public Long idDeliveryShipper;
    public Long idPickupShipper;
    public String status;
    public LocalDateTime createdAt;
    public Long revenue;
}
