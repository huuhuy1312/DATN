package com.example.file_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@AllArgsConstructor
public class AddFileRequest {
    private List<MultipartFile> files;
    private String objectName;
    private Long objectId;
}
