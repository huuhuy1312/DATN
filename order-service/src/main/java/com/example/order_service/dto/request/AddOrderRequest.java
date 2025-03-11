package com.example.order_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddOrderRequest {
    public List<Long> voucherIds;
    public Long customerId;
    public Long addressShipId;
    public Long totalAmount;
    public Long totalAmountForVNpay;
    public String paymentMethod;
    public List<AddOrderLineRequest> addOrderLineRequests;

}
