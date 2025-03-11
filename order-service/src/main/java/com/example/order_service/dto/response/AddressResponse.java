package com.example.order_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {
    private Long id;
    private String city;
    private String ward;
    private String district;
    private String addressDetails;
    private String nameUser;
    private String phoneNumberUser;
    private Double latitude;
    private Double longitude;

    public AddressResponse(Long id, String city, String ward, String district, String addressDetails, String nameUser, String phoneNumberUser) {
        this.id = id;
        this.city = city;
        this.ward = ward;
        this.district = district;
        this.addressDetails = addressDetails;
        this.nameUser = nameUser;
        this.phoneNumberUser = phoneNumberUser;
    }
}
