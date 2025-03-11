package com.bezkoder.springjwt.payload.response;

import lombok.Data;

@Data
public class AccountResponse {
    public Long id;
    public String username;
    public String password;
}
