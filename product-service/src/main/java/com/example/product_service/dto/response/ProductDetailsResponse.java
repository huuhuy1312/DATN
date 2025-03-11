package com.example.product_service.dto.response;

import com.example.product_service.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class ProductDetailsResponse {
    public long id;//
    public String name;//
    public String description;//
    public List<String> listLabel1;
    public List<String> listLabel2;
//    public double rate_star;
    public Integer soldQuantity;
    public Integer countRates;
    public String title1;//
    public String title2;//
    public String origin;//
    public List<TypeOfProductInProductResponse> typeOfProducts;//
    public CategoryResponse category;//
    public List<String> categories;
    public Supplier supplier;//
    public List<ImageClassificationResponse> imageClassifications;//
    public List<FileInfoResponse> imageProducts;//
    public SellerInfoResponse seller;
    public LocalDateTime createdAt;

    public ProductDetailsResponse(long id, String name, String title2, String title1, String origin, CategoryResponse category, Supplier supplier) {
        this.id = id;
        this.name = name;
        this.title2 = title2;
        this.title1 = title1;
        this.origin = origin;
        this.category = category;
        this.supplier = supplier;
    }
}
