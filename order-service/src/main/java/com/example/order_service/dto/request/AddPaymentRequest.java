package com.example.order_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddPaymentRequest {
    public Long amount;
    public Long objectId;
    public String objectName;
    public String purpose;
    public String bank;
    public Boolean isBack;
    public String reasonBack;
}
