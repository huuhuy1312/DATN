package com.bezkoder.springjwt.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellerFullInfoResponse {
    public Long id;
    public String shopName;
    public String email;
    public String phoneNumber;
    public String CIN;
    public String fullName;
    public Long idAccount;
}
