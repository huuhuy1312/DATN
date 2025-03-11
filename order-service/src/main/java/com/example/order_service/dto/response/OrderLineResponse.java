package com.example.order_service.dto.response;

import com.example.order_service.dto.request.ItemDetailResponse;
import com.example.order_service.entity.ShippingMethods;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderLineResponse {
    public Long id;
    public String code;
    public List<ItemDetailResponse> items;
    public Long sellerId;
    public String reasonCancel;
    public String status;
    public LocalDateTime createdAt;
    public LocalDateTime confirmTime;
    public LocalDateTime shipperPickupTime;
    public LocalDate sellerPickupRequestDate;
    public LocalDateTime deliveryWarehouseReceiveTime;
    public LocalDateTime shipperDeliveryTime;
    public LocalDateTime doneTime;
    public LocalDateTime paymentTime;
    public String customerMessage;
    public ShippingMethods shippingMethods;
    public String orderCode;
    public Long totalAmount;
    public String waybillCode;
    public AddressResponse addressCustomer;
    public AddressResponse addressSeller;
    public Long idPickupShipper;
    public Long idPickupWarehouse;
    public Long idDeliveryWarehouse;
    public Long idDeliveryShipper;
    public LocalDateTime receivedAt;
    public Long shipCost;
    public Long reduceAmount;
}
