package com.example.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShipperDto {
    public Long id;
    public String code;
    public String name;
    public String note;
    public String phoneNumber;
    public String username;
    public String password;
    public String newPassword;
}
