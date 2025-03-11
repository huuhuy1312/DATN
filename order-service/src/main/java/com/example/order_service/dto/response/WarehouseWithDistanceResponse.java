package com.example.order_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class WarehouseWithDistanceResponse {
    private Long id;
    private String warehouseName;
    private AddressResponse addressResponse;
    private Double distance;

}

