package com.example.file_service.service;

import com.example.file_service.dto.AddFileRequest;
import com.example.file_service.dto.response.FileInfoResponse;
import com.example.file_service.dto.response.FileResponse;
import com.example.file_service.entity.FileEntity;
import com.example.file_service.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileService {

    @Value("${file.upload-dir}")
    private String fileDir;
    private final FileRepository fileRepository;

    @Autowired
    private MongoTemplate mongoTemplate;
    public boolean isHTMLFile(MultipartFile file){
        String contentType = file.getContentType();
        return contentType != null &&(contentType.startsWith("image/") || contentType.equals("text/html")) ;
    }
    public List<String> storeFiles(AddFileRequest addFileRequest) throws IOException {
        System.out.println(addFileRequest.getFiles().size());
        List<String> savedFileNames = new ArrayList<>();

        for (MultipartFile file : addFileRequest.getFiles()) {
            // Kiểm tra file hợp lệ
            if (!isHTMLFile(file) || file.getOriginalFilename() == null) {
                throw new IOException("Invalid format file: " + file.getOriginalFilename());
            }

            // Xử lý tên file và tạo tên file duy nhất
            String baseFileName = StringUtils.cleanPath(file.getOriginalFilename());
            String uniqueFileName = UUID.randomUUID().toString() + "_" + baseFileName;

            // Tạo thư mục upload nếu chưa tồn tại
            Path uploadDir = Paths.get(fileDir);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Lưu file vào thư mục đích
            Path destination = Paths.get(uploadDir.toString(), uniqueFileName);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            // Tạo và lưu FileEntity vào database
            FileEntity fileEntity = new FileEntity(addFileRequest.getObjectName(), addFileRequest.getObjectId(), uniqueFileName);
            fileRepository.save(fileEntity);

            // Thêm tên file vào danh sách kết quả
            savedFileNames.add(uniqueFileName);
        }

        return savedFileNames;
    }

    public List<String> getImages(Long objectId,String objectName){
        List<FileResponse> imageName = fileRepository.findFileResponsesByObjectNameAndObjectId(objectName,objectId);
        List<String> imageNames = imageName.stream().map(
                FileResponse::getName
        ).toList();

        List<String> result = new ArrayList<>();
        for (String item:imageNames){
            result.add(readImage(item));
        }
        return result;
    }
    public List<FileInfoResponse> getInfoImages(Long objectId,String objectName){
        List<FileResponse> files = fileRepository.findFileResponsesByObjectNameAndObjectId(objectName,objectId);
        List<FileInfoResponse> result = new ArrayList<>();
        for (FileResponse item:files){
            result.add(new FileInfoResponse(item.id.toString(),item.objectName,item.objectId,item.name,readImage(item.name)));
        }
        return result;
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
    public String readHtmlFile(Long objectId, String objectName) {
        try {
            List<FileResponse> imageName = fileRepository.findFileResponsesByObjectNameAndObjectId(objectName,objectId);
            Path destinations = Paths.get(fileDir);
            Path htmlPath = destinations.resolve(imageName.get(0).getName()).normalize();
            return new String(Files.readAllBytes(htmlPath));
        } catch (IOException e) {
            return "Error reading HTML file";
        }
    }
    public void softDeleteFileByObjectNameAndObjectId(String objectName, Long objectId) {
        // Tạo query tìm theo objectName và objectId
        Criteria criteria = Criteria.where("objectName").is(objectName)
                .and("objectId").is(objectId);

        // Tạo update để đặt isDeleted = true
        Update update = new Update().set("isDeleted", true);

        // Thực hiện update trên MongoDB
        mongoTemplate.updateMulti(Query.query(criteria), update, FileEntity.class);
    }
}
