package com.bezkoder.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
public class AddAddressRequest {

    private String city;
    private String nameUser;
    private String phoneNumberUser;
    private String district;
    private String ward;
    private String addressDetails;
    private Long sellerId;
    private Long customerId;

}
