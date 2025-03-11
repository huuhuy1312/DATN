package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class TypeOfProductInItemResponse {
    public Long topId;
    public String label1;
    public String label2;
    public String productName;
    public Long productId;
    public Long sellerId;
    public Long price;
    public List<String> listClassifications1;
    public List<String>listClassifications2;
    public String shopName;
    public Long maxQuantity;
    public Long originalPrice;
    public Long weight;
    public String owner;
    public String image;
    public Long cost;
}
