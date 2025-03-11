package com.example.order_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VoucherDto {
    public Long id;
    public String code;
    public String type;
    public Long reduceMaxAmount;
    public Long conditionAmount;
    public Double percentReduce;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public LocalDateTime startDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public LocalDateTime endDate;
    public Long maxQuantity;
    public Boolean isActive;

    public VoucherDto(String type, Long conditionAmount, Long reduceMaxAmount, Double percentReduce, LocalDateTime startDate, LocalDateTime endDate) {
        this.type = type;
        this.conditionAmount = conditionAmount;
        this.reduceMaxAmount = reduceMaxAmount;
        this.percentReduce = percentReduce;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
