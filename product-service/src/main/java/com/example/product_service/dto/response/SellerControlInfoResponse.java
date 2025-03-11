package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellerControlInfoResponse {
    public Long idSeller;
    public Long totalCustomer;
    public Long totalProduct;
    public Long totalOrder;
    public Long totalLowStock;
    public List<TOPRevenueResponse> topRevenueResponses;
}
