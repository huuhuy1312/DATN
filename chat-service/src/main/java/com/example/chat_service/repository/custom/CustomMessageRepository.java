package com.example.chat_service.repository.custom;

public interface CustomMessageRepository {
    void markMessagesAsRead(String receiver, String sender);
}
