package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    public Long id;
    public  String name;
    public Long countChild;
    public CategoryResponse( Long id,String name) {
        this.name = name;
        this.id = id;
    }



}
