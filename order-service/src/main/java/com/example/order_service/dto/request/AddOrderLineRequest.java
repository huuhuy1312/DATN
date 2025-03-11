package com.example.order_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddOrderLineRequest {
    private List<Long> itemIds;
    private Long sellerId;
    private String customerMessage;
    private Long shippingMethodId;
    public Long shipCost;
    public Long totalPrice;
    public Long revenue;

}
