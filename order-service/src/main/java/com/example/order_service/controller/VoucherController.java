package com.example.order_service.controller;

import com.example.order_service.dto.VoucherDto;
import com.example.order_service.dto.response.AllVoucherResponse;
import com.example.order_service.entity.Voucher;
import com.example.order_service.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/voucher")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class VoucherController {
    private final VoucherService voucherService;

    @PostMapping("/add")
    public ResponseEntity<String> addVoucher(@RequestBody VoucherDto voucherDto){
        voucherService.add(voucherDto);
        return ResponseEntity.ok("Thêm voucher thành công");
    }

    @GetMapping("/all")
    public ResponseEntity<AllVoucherResponse> getAllVouchers(){
        return ResponseEntity.ok(voucherService.findAllVoucher());
    }

}
