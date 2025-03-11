package com.example.order_service.controller;

import com.example.order_service.dto.request.AddAddressRequest;
import com.example.order_service.dto.response.WarehouseWithDistanceResponse;
import com.example.order_service.entity.Address;
import com.example.order_service.repository.AddressRepository;
import com.example.order_service.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/address")
public class AddressController {
    private final AddressService addressService;
    private final AddressRepository addressRepository;
    @GetMapping("/find-by-customer-id")
    public ResponseEntity<List<Address>> findByCustomerId(@RequestParam(name = "customerId")Long customerId){
        return ResponseEntity.ok(addressService.findByCustomerId(customerId));
    }

    @GetMapping("/find-by-seller-id")
    public ResponseEntity<Address> findBySellerId(@RequestParam(name = "sellerId")Long sellerId){
        return ResponseEntity.ok(addressService.findBySellerId(sellerId));
    }
    @GetMapping("/find-address-near-address")
    public ResponseEntity<Page<WarehouseWithDistanceResponse>> findAddressNearAddress(@RequestParam(name = "addressId")Long addressId, Pageable pageable){
        return ResponseEntity.ok(addressService.findAddressNearAddress(addressId,pageable));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addAddress(@RequestBody AddAddressRequest addAddressRequest)
    {
        addressService.add(addAddressRequest);
        return ResponseEntity.ok("Successful");
    }

    @DeleteMapping("/delete-by-id")
    public void deleteById(@RequestParam("id") Long id)
    {
        addressRepository.deleteById(id);
    }
}
