package com.example.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class ShippingMethodsDto {
    public Long id;
    public Long priceFrom0To1kg;
    public Long priceFrom1To1_5kg;
    public Long priceFrom1_5To2kg;
    public Long priceNext0_5kg;
    public Long pricePer1Km;
    public String description;
    public String name;
    public int dayStandard;
    public Long voucherId;
    public Long voucherReduce;
}
