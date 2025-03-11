package com.example.order_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateItemRequest {
    private Long id;
    private Long productId;
    private String label1;
    private String label2;
    private Long customerId;
    private Integer quantity;
    private Boolean isRated;
}
