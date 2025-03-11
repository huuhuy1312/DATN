package com.bezkoder.springjwt.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellerResponse {
    public long id;
    public Long idAccount;
    public String shopName;
    public String owner;
    public String avatar;
}
