package com.bezkoder.springjwt.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String fileDir;
    public boolean isImageFileorHTMLFile(MultipartFile file){
        String contentType = file.getContentType();
        return contentType != null && (contentType.startsWith("image/") || contentType.equals("text/html"));
    }
    public String storeFile(MultipartFile file) throws IOException {
        if(!isImageFileorHTMLFile(file) || file.getOriginalFilename() == null){
            throw new IOException("Invalid format file");
        }
        String baseFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID().toString() + "_" + baseFileName;
        Path uploadDir = Paths.get(fileDir);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
        Path destinations = Paths.get(uploadDir.toString(), uniqueFileName);
        System.out.println(destinations);
        Files.copy(file.getInputStream(), destinations, StandardCopyOption.REPLACE_EXISTING);
        return uniqueFileName;
    }
    public ResponseEntity<?> uploadHtmlFileService(MultipartFile file) throws IOException {
        if (file.isEmpty()){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Vui lòng upload file có nội dung");
        }
        if (file.getSize()>10*1024*1024){
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("File "+ file.getName()+"quá lớn");
        }
        if (file.getContentType() == null || !file.getContentType().equals("text/html")) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body("File "+file.getName()+" không đúng định dạng");
        }
        try {
            String newFile = storeFile(file);
            return ResponseEntity.ok(newFile);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file.");
        }
    }
//    public void deleteFileByName(String nameFile){
//        String filePath =
//    }
    public void deleteByNames(List<String> names)
    {
        for(String name:names)
        {
            File file = new File(fileDir+"/"+name);
            file.deleteOnExit();
        }
    }
    public String readImage(String imageName){
        try {
            Path destinations = Paths.get(fileDir);
            Path imagePath = destinations.resolve(imageName).normalize();
            byte[] imageBytes;
            if (Files.exists(imagePath)) {
                imageBytes = Files.readAllBytes(imagePath);
            } else {
                Path notFoundImagePath = destinations.resolve("not_found.jpg").normalize();
                imageBytes = Files.readAllBytes(notFoundImagePath);
            }
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            return "data:image/png;base64," + base64Image;
        } catch (IOException e) {
            return "Error reading image";
        }
    }
}
