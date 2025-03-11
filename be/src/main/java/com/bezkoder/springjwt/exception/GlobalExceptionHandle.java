package com.bezkoder.springjwt.exception;

import com.bezkoder.springjwt.payload.response.ResponseObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandle {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseObject<Object>> handleFileException(Exception e) {
        // Tạo đối tượng ResponseObject với thông tin lỗi
        ResponseObject<Object> responseObject = ResponseObject.<Object>builder()
                .status(HttpStatus.BAD_REQUEST) // Trạng thái HTTP 400
                .statusCode(HttpStatus.BAD_REQUEST.value()) // Mã trạng thái
                .message(e.getMessage()) // Thông điệp lỗi
                .data(null)
                .build();
        // Trả về phản hồi với mã trạng thái 400 Bad Request
        return ResponseEntity.badRequest().body(responseObject);
    }
}

