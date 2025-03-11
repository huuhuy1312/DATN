package com.example.product_service.controller;

import com.example.product_service.dto.response.TypeOfProductInItemResponse;
import com.example.product_service.entity.TypeOfProduct;
import com.example.product_service.repository.TypeOfProductRepository;
import com.example.product_service.service.TypeOfProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/type-of-product")
@RequiredArgsConstructor
public class TypeOfProductController {
    private final TypeOfProductService typeOfProductService;
    private final TypeOfProductRepository typeOfProductRepository;
    @GetMapping("/get-details-in-cart")
    private ResponseEntity<List<TypeOfProductInItemResponse>> getDetailsInCart(@RequestParam(name = "top_ids") List<Long> top_ids){
        return ResponseEntity.ok(typeOfProductService.getDetailsTOPInCart(top_ids));
    }

    @GetMapping("/get-id-by-label")
    private ResponseEntity<Long> getIdByLabel(@RequestParam(name = "label1") String label1,
                                              @RequestParam (name = "label2",required = false) String label2,
                                              @RequestParam(name = "productId") Long productId){
        return ResponseEntity.ok(typeOfProductService.getIdByLabel1AndLabel2AndProductId(label1,label2,productId));
    }

    @GetMapping("/update-quantity")
    public void updateQuantity(@RequestParam(name = "soldQuantity")Integer soldQuantity, @RequestParam(name = "topId")Long topId)
    {
        TypeOfProduct type = typeOfProductRepository.findById(topId).get();
        type.setQuantity(type.getQuantity()-soldQuantity);
        type.setSoldQuantity(type.getSoldQuantity()+soldQuantity);

        typeOfProductRepository.save(type);

    }

}
