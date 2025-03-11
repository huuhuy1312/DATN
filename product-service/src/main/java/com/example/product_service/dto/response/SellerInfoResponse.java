package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class SellerInfoResponse {
    public Long id;
    public Long idAccount;
    public String shopName;
    public String owner;
    public String avatar;
}
