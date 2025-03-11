package com.example.order_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddAccountRequest {
    public Long id;
    public String username;
    public String password;

    public AddAccountRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
