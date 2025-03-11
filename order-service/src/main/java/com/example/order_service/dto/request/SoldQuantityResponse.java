package com.example.order_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SoldQuantityResponse {
    public Long typeOfProductId;
    public Integer year;
    public Integer month;
    public Long soldQuantity;
}
