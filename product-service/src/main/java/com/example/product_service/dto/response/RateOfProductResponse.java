package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RateOfProductResponse {
    public Double averageRate;
    public Long rate5Star;
    public Long rate4Star;
    public Long rate3Star;
    public Long rate2Star;
    public Long rate1Star;
    public Long totalRate;
    public List<RateResponse> rateResponses;
}
