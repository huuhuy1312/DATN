package com.example.order_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddAddressRequest {
    public Long id;
    public String city;
    public String district;
    public String ward;
    public String addressDetails;
    public String nameUser;
    public String phoneNumberUser;
    public Boolean isDeleted;
    public Boolean isDefault;
    public Long customerId;
    public Long sellerId;
}
