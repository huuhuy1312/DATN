package com.example.order_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcessOrderLineItemResponse {
    public LocalDateTime time;
    public String message;
    public String title;
}
