package com.bezkoder.springjwt.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerHaveImageResponse {
    public Long id;
    public String shopName;
    public String email;
    public String phoneNumber;
    public String CIN;
    public String fullName;
    public String imageCICard;
    public String imageHoldCICard;
    public Boolean isActive;
    public LocalDateTime createdAt;
    public Long idAccount;
}
