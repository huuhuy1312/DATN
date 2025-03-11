package com.example.order_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
@Entity

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;//

    private Long amount;//

    private Long objectId;//

    private String objectName;//

    private LocalDateTime createdDate;
    private Long orderId;
    private Long orderLineId;

    private String accountNumber;//

    private String purpose;//

    private String bank;//

    private Boolean isBack = false;

    private String reasonBack;
}
