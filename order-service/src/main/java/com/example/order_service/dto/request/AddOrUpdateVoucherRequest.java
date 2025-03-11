package com.example.order_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddOrUpdateVoucherRequest {
    private long id;
    private String type;
    private long reduceMaxAmount;
    private long conditionAmount;
    private double percentReduce;
    private MultipartFile imageFile;
    private Long idShop;
    @DateTimeFormat
    private LocalDateTime startDate;

    @DateTimeFormat
    private LocalDateTime endDate;

    private  boolean isActive;
}
