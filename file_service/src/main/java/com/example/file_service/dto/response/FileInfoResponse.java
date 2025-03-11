package com.example.file_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileInfoResponse {
    private String id;
    private String objectName;
    private Long objectId;
    private String name;
    private String content;
}
