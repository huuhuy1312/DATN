package com.example.product_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddRateRequest {
    private Long itemId;
    private Long customerId;
    private String content;
    private Integer rateStar;
    private Long typeOfProductId;
    private List<MultipartFile> files;
}
