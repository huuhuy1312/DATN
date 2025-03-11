package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryAndChildResponse {
    public Long id;
    public String name;
    public List<CategoryAndChildResponse> childs;
}
