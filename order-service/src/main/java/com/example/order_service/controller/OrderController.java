package com.example.order_service.controller;

import com.example.order_service.dto.request.AddOrderRequest;
import com.example.order_service.dto.request.FilterOrderRequest;
import com.example.order_service.service.OrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/add")
    public ResponseEntity<String> addOrder(@RequestBody AddOrderRequest addOrderRequest) {
        orderService.addOrder(addOrderRequest);
        return ResponseEntity.ok("Thêm order thành công");
    }

    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody FilterOrderRequest request) throws JsonProcessingException {
        return ResponseEntity.ok(orderService.search(request));
    }
    @PostMapping("/static-order-of-warehouse")
    public ResponseEntity<?> staticOrderOfWarehouse(@RequestBody List<Long> ids) throws JsonProcessingException {
        return ResponseEntity.ok(orderService.staticOrderOfWarehouses(ids));
    }

    @PostMapping("/static-order-of-seller")
    public ResponseEntity<?> staticOrderOfSeller() throws JsonProcessingException {
        return ResponseEntity.ok(orderService.staticOrderOfSeller());
    }


}
