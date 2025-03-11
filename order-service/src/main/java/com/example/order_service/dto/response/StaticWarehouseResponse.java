package com.example.order_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaticWarehouseResponse {
    public WarehouseWithDistanceResponse warehouse;
    public List<OrderLineResponse> orderLines;

}
