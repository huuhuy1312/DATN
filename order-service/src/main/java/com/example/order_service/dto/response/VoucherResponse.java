package com.example.order_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherResponse {
    private Long id;
    private String type;
    private String code;
    private Long reduceMaxAmount;
    private Long conditionAmount;
    private Double percentReduce;

//    private String image;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long maxQuantity;
    private Boolean isActive;
}
