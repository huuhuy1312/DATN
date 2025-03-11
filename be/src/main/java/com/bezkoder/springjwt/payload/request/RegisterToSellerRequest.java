package com.bezkoder.springjwt.payload.request;

import org.springframework.web.multipart.MultipartFile;

public class RegisterToSellerRequest {
    private long userId;
    private String nameShop;
    private AddAddressRequest addAddressRequest;
    private String email;
    private String phoneNumber;
    private String documentType;
    private String documentNumber;
    private String fullName;
    private MultipartFile frontImage;
    private MultipartFile holdingImage;
}
