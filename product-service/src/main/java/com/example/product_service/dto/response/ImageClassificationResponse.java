package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageClassificationResponse {
    public Long id;
    public FileInfoResponse image;
    public String label1;
    public Long productId;
}
