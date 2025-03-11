package com.example.order_service.dto.response;

import com.example.order_service.dto.request.ItemDetailResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShopGroupedItemsResponse {
    private String shopName;
    private Long sellerId;
    private String city;
    private String district;
    private String ward;
    private Double latitude;
    private Double longitude;
    private double totalWeight;
    private double totalPrice;
    private double shipCost;
    private double reduceShipCost;
    private List<ItemDetailResponse> items;

    // Getters and setters
}

