package com.example.order_service.dto.response;

import com.example.order_service.entity.Warehouse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaticShipProviderAdminResponse{
    public List<Warehouse> warehouses;
    public List<OrderResponse> orders;
    public List<SellerResponse> sellers;

}
