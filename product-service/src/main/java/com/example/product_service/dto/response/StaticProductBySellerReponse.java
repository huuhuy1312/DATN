package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class StaticProductBySellerReponse {
    public Long sellerId;
    public Long countProduct;
    public Long countRate;
    public Double rateStar;
}
