package com.example.product_service.controller;

import com.example.product_service.dto.request.AddRateRequest;
import com.example.product_service.service.RateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("api/rate")
@RequiredArgsConstructor
public class RateController {
    private final RateService rateService;

    @PostMapping("/add")
    public ResponseEntity<?> addRate(@ModelAttribute AddRateRequest addRateRequest) throws IOException {
        rateService.addRate(addRateRequest);
        return ResponseEntity.ok("Thêm rate thành công");
    }
    @GetMapping("/filter-by-product-id")
    public ResponseEntity<?> filterByProductId(@RequestParam("idProduct")Long idProduct){
        return ResponseEntity.ok(rateService.findByProductId(idProduct));
    }
}
