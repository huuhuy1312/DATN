package com.example.product_service.repository.custom;

import com.example.product_service.dto.response.TypeOfProductInItemResponse;

import java.util.List;

public interface CustomTypeOfProductRepository  {
    List<TypeOfProductInItemResponse> findTOPInCartCustom(List<Long> list_top_ids);
}
