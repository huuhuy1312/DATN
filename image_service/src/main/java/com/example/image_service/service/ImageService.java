package com.example.image_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ImageService {
    @Value("${file.upload-dir}")
    private String fileDir;
}
