package com.bezkoder.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AddRateRequest {
    public long productId;
    public int rateStar;
    public String rateReview;
    public long customerId;
}
