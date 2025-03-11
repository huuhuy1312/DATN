package com.bezkoder.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@ToString
public class AddSellerRequest {
    private Long accountId;
    private String shopName;
    private String email;
    private String phoneNumber;
    private String CIN;
    private String fullName;
    private MultipartFile avatarShop;
    private MultipartFile imageCICard;
    private MultipartFile imageHoldCICard;
}
