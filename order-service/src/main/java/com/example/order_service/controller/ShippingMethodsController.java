package com.example.order_service.controller;

import com.example.order_service.dto.ShippingMethodsDto;
import com.example.order_service.service.ShippingMethodsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
@RequestMapping("/api/shipping-methods")
@RequiredArgsConstructor
public class ShippingMethodsController {
    private final ShippingMethodsService shippingMethodsService;

    @GetMapping("/all")
    public ResponseEntity<List<ShippingMethodsDto>> getAllShippingMethods(){
        return ResponseEntity.ok(shippingMethodsService.getAllShippingMethods());
    }
}
