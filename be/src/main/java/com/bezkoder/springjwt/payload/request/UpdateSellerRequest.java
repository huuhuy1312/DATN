package com.bezkoder.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSellerRequest {
    public Long id;
    public String reasonLock;
    public Boolean isActive;
    public Boolean isDeleted;
}
