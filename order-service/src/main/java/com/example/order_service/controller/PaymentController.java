package com.example.order_service.controller;

import com.example.order_service.dto.request.AddPaymentRequest;
import com.example.order_service.entity.Payment;
import com.example.order_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Objects;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;
    @PostMapping("/add")
    public ResponseEntity<?> createPayment(@RequestBody AddPaymentRequest request)
    {
        Payment payment = new Payment();
        payment.setAmount(request.getAmount());
        payment.setObjectId(request.getObjectId());
        payment.setObjectName(request.getObjectName());
        payment.setPurpose(request.purpose);
        payment.setBank(request.getBank());
        if(Objects.equals(request.bank, "NCB"))
        {
            payment.setAccountNumber("9704198526191432198");
        } else if (request.bank.contains("JCB")) {
            payment.setAccountNumber("3337000000000008");
        } else if (request.bank.contains("NAPAS")) {
            payment.setAccountNumber("9704000000000018");
        } else if (request.bank.contains("EXIMBANK"))
        {
            payment.setAccountNumber("9704310005819191");
        }else{
            payment.setAccountNumber("012345678910");
        }
        if(!ObjectUtils.isEmpty(request.isBack))
        {
            payment.setIsBack(true);
        }
        if(!ObjectUtils.isEmpty(request.reasonBack))
        {
            payment.setReasonBack(request.reasonBack);
        }
        payment.setCreatedDate(LocalDateTime.now());
        paymentRepository.save(payment);
        return ResponseEntity.ok("Thành công");
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll()
    {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

}
