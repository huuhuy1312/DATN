package com.example.order_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterCountOrderLineRequest {
    public Long pickupWarehouseAccountId;
    public Long pickupShipperAccountId;
    public Long deliveryWarehouseAccountId;
    public Long deliveryShipperAccountId;
}
