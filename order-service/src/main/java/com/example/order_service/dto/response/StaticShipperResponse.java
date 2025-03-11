package com.example.order_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaticShipperResponse {
    public Long id;
    public String code;
    public String name;
    public String phoneNumber;
    public String username;
    public String note;
    public Long shippingOrdersCount;
    public Long doneOrdersCount;
    public Long pickingUpOrdersCount;
}
