package com.example.order_service.dto.response;

import com.example.order_service.entity.Address;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellerResponse {
    public Long id;
    public String shopName;
    public String phoneNumber;
    public String email;
    public String CIN;
    public String fullName;
}
