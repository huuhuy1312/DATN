package com.example.order_service.controller;

import com.example.order_service.dto.ShipperDto;
import com.example.order_service.dto.response.StaticShipperResponse;
import com.example.order_service.entity.Shipper;
import com.example.order_service.repository.ShipperRepository;
import com.example.order_service.service.ShipperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/shipper")
@RequiredArgsConstructor
public class ShipperController {
    private final ShipperService shipperService;
    private final ShipperRepository shipperRepository;
    @GetMapping("/find-by-warehouse")
    public ResponseEntity<List<StaticShipperResponse>> findByWarehouse(@RequestParam(name = "warehouseId") Long warehouseId){
        return ResponseEntity.ok(shipperService.findByWarehouseId(warehouseId));
    }
    @GetMapping("/find-by-account-warehouse")
    public ResponseEntity<List<StaticShipperResponse>> findByAccountWarehouse(@RequestParam(name = "accountId") Long accountId){
        return ResponseEntity.ok(shipperService.findByAccountWarehouseId(accountId));
    }
    @GetMapping("/static-by-warehouse")
    public ResponseEntity<List<StaticShipperResponse>> staticByWarehouse(@RequestParam(name = "warehouseId") Long warehouseId){
        return ResponseEntity.ok(shipperService.staticByWarehouseId(warehouseId));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addShipper(@RequestBody ShipperDto shipperDto)
    {
        shipperService.add(shipperDto);
        return ResponseEntity.ok("Thành công");
    }
    @GetMapping("/all")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(shipperRepository.findAll());
    }
}
