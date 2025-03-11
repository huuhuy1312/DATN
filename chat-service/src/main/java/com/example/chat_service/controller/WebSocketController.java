package com.example.chat_service.controller;


import com.example.chat_service.entity.ChatMessage;
import com.example.chat_service.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class WebSocketController {

    @Autowired
    private  SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;
    @MessageMapping("/chat.sendPrivateMessage")
    public void sendPrivateMessage(ChatMessage message) {
        System.out.println("Received message: " + message);
        message.setCreateDate(LocalDateTime.now());// Log received message
        messageRepository.save(message);
        messagingTemplate.convertAndSendToUser(message.getReceiver(), "/queue/messages", message);
    }
}