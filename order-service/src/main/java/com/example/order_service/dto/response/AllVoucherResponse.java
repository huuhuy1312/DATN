package com.example.order_service.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllVoucherResponse {
    List<VoucherResponse> listShippingVoucher;
    List<VoucherResponse> listDiscountVoucher;
}
