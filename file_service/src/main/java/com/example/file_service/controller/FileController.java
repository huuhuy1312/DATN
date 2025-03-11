package com.example.file_service.controller;

import com.example.file_service.dto.AddFileRequest;
import com.example.file_service.dto.response.FileInfoResponse;
import com.example.file_service.dto.response.FileResponse;
import com.example.file_service.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/file")
@CrossOrigin(origins = "*",maxAge = 3600)
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;
    @PostMapping("/save")
    public ResponseEntity<?> addHTMLFile(@ModelAttribute AddFileRequest addFileRequest) throws IOException {
        return ResponseEntity.ok(fileService.storeFiles(addFileRequest));
    }

    @GetMapping("/read-description-file")
    public ResponseEntity<String> viewImage(@RequestParam("objectId") Long objectId, @RequestParam("objectName") String objectName) {
        return  ResponseEntity.ok(fileService.readHtmlFile(objectId,objectName));
    }

    @GetMapping("/get-images")
    public ResponseEntity<List<String>> getImage(@RequestParam("objectId") Long objectId, @RequestParam("objectName") String objectName)
    {
        return ResponseEntity.ok(fileService.getImages(objectId,objectName));
    }

    @GetMapping("/get-info-images")
    public ResponseEntity<List<FileInfoResponse>> getInfoImage(@RequestParam("objectId") Long objectId, @RequestParam("objectName") String objectName){
        return ResponseEntity.ok(fileService.getInfoImages(objectId,objectName));
    }

    @PostMapping(value = "/softDelete")
    public String softDeleteFile(@RequestParam ("objectName")String objectName, @RequestParam("objectId") Long objectId) {
        fileService.softDeleteFileByObjectNameAndObjectId(objectName, objectId);
        return "File marked as deleted";
    }
}
