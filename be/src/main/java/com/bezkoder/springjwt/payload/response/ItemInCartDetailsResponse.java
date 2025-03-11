package com.bezkoder.springjwt.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Arrays;
import java.util.List;

@Data
@AllArgsConstructor
public class ItemInCartDetailsResponse {
    private long id;
    private long topId;
    private String label;
    private String image;
    private String productName;
    private long sellerId;
    private String shopName;
    private long price;
    private int quantity;
    private List<String> listClassifications1;
    private List<String> listClassifications2;


    // Ensure this constructor exists
    public ItemInCartDetailsResponse(long id,String image, String productName,long sellerId,String shopName, long price, int quantity, String listClassifications1, String listClassifications2,long topId,String label) {
        this.id = id;
        this.topId = topId;
        this.label = label;
        this.image = image;
        this.productName = productName;
        this.sellerId = sellerId;
        this.shopName = shopName;
        this.price = price;
        this.quantity = quantity;
        this.listClassifications1 = Arrays.stream(listClassifications1.split(",")).toList();
        this.listClassifications2 = Arrays.stream(listClassifications2.split(",")).toList();
    }
}
