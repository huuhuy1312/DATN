package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class ProductNotDetailsResponse {
    public long id;
    public String name;
    public long price;
//    public double rateStar;
//    public int soldQuantity;
//    public String image;
    public String origin;
}
