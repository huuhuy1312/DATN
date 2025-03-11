package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TOPRevenueResponse {
    public Long typeOfProductId;
    public Integer year;
    public Integer month;
    public Long soldQuantity;
    public Long revenue;
    public Long profit;
}