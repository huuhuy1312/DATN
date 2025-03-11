package com.example.product_service.service;

import com.example.product_service.dto.response.TypeOfProductInItemResponse;
import com.example.product_service.repository.TypeOfProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TypeOfProductService {
    private final TypeOfProductRepository typeOfProductRepository;

    public List<TypeOfProductInItemResponse> getDetailsTOPInCart(List<Long> top_ids){
        return typeOfProductRepository.findTOPInCartCustom(top_ids);
    }

    public Long getIdByLabel1AndLabel2AndProductId(String label1,String label2,Long productId){
        return typeOfProductRepository.getIdByLabel1AndLabel2AndProductId(label1,label2,productId);
    }
}
