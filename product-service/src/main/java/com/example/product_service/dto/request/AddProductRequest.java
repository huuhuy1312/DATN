package com.example.product_service.dto.request;

import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@AllArgsConstructor
public class AddProductRequest {
    public Long id;
    public String name;
    public String title1;
    public String title2;
    public long sellerId;
    public MultipartFile description;
    public long categoryId;
    public long supplierId;
    public List<MultipartFile> imageLabel1s;
    public String listTypeOfProduct;

    public List<MultipartFile> imageProducts;

}
