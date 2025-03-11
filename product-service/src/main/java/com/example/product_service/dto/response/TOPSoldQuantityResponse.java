package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TOPSoldQuantityResponse {
    public Long typeOfProductId;
    public Integer year;
    public Integer month;
    public Long soldQuantity;
}
