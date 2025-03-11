package com.example.product_service.controller;

import com.example.product_service.entity.Supplier;
import com.example.product_service.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;
    @PostMapping("/add")
    public ResponseEntity<?> addSupplier(@RequestParam(name = "nameSupplier") String nameSupplier){
        supplierService.addSupplier(nameSupplier);
        return ResponseEntity.ok("Thêm nhà cung cấp thành công");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Supplier>> getAllSupplier(){
        return ResponseEntity.ok(supplierService.findAll());
    }

}
