package com.example.order_service.dto.response;

import lombok.Data;

@Data
public class AccountResponse {
    public Long id;
    public String username;
    public String password;
}
