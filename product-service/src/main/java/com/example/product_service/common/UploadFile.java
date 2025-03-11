package com.example.product_service.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Configuration
public class UploadFile {

    @Autowired
    private RestTemplate restTemplate;

    public ResponseEntity<String> uploadFile(List<MultipartFile> files, Long objectId, String objectName) throws IOException {
        String url = "http://localhost:8081/file/save";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Sử dụng MultiValueMap để truyền file và các thông tin khác
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        // Duyệt qua từng tệp và thêm chúng vào MultiValueMap
        for (MultipartFile multipartFile : files) {
            ByteArrayResource byteArrayResource = new ByteArrayResource(multipartFile.getBytes()) {
                @Override
                public String getFilename() {
                    return multipartFile.getOriginalFilename(); // Đảm bảo rằng bạn gửi tên tệp
                }
            };
            body.add("files", byteArrayResource); // Thêm mỗi tệp vào "file"
        }

        // Thêm các thông tin khác vào body
        body.add("objectName", objectName);
        body.add("objectId", objectId);

        // Tạo HttpEntity với body và headers
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        // Gửi request
        return restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
    }

}
