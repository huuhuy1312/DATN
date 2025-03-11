package com.example.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseDto {
    public Long id;
    public String nameUser;
    public String phoneNumberUser;
    public String username;
    public String password;
    public String city;
    public String district;
    public String ward;
    public String addressDetails;
    public String changePassword;
}
