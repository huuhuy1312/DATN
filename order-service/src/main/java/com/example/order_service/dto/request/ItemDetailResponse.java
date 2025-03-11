package com.example.order_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDetailResponse {
    private Long id;
    private String codeOrder;
    private long quantity;
    private Long topId;
    private String label1;
    private String label2;
    private String productName;
    private Long productId;
    private Long sellerId;
    private Long price;
    private List<String> listClassifications1;
    private List<String> listClassifications2;
    private String shopName;
    private Long maxQuantity;
    private Long originalPrice;
    private Long weight;
    private String owner;
    private String image;
    private Long cost;
    public Boolean isRated;

}
