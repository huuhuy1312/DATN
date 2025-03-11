package com.example.chat_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document("Message")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    @Id
    private String id;
    private String sender;
    private String receiver; // Người nhận tin nhắn
    private String content;
    private boolean isReaded = false; // Trường trạng thái đọc

    @CreatedDate
    private LocalDateTime createDate; // Trường tự động sinh ngày tạo
}