package com.example.chat_service.controller;

import com.example.chat_service.entity.ChatMessage;
import com.example.chat_service.repository.MessageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/message")
@CrossOrigin(origins = "*")
public class MessageController {
    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/find-receiver-by-sender")
    public Set<String> findUniqueReceiversAndSenders(@RequestParam("user") String user) {
        List<ChatMessage> results = messageRepository.findDistinctReceiversAndSenders(user);
        Set<String> uniqueUsers = new HashSet<>();

        for (ChatMessage message : results) {
            if (message.getReceiver() != null) uniqueUsers.add(message.getReceiver());
            if (message.getSender() != null) uniqueUsers.add(message.getSender());
        }

        return uniqueUsers;
    }

    @GetMapping("/partners-with-unread-count")
    public List<Map<String, Object>> getPartnersWithUnreadCount(@RequestParam("user") String user) {
        Set<String> uniqueUsers = findUniqueReceiversAndSenders(user);
        uniqueUsers.remove(user); // Loại bỏ chính user khỏi danh sách

        List<Map<String, Object>> partnersWithUnreadCount = new ArrayList<>();

        for (String partner : uniqueUsers) {
            // Đếm số tin nhắn chưa đọc từ partner đến user
            int unreadCount = messageRepository.findUnreadMessages(user, partner).size();

            Map<String, Object> partnerData = new HashMap<>();
            partnerData.put("partner", partner);
            partnerData.put("unreadCount", unreadCount);
            partnersWithUnreadCount.add(partnerData);
        }

        return partnersWithUnreadCount;
    }

    @GetMapping("/chat-with-partner")
    public List<ChatMessage> getMessagesWithPartner(@RequestParam("user") String user, @RequestParam("partner") String partner) {
        return messageRepository.findMessagesBetweenUsers(user, partner);
    }

    @PostMapping("/update-status")
    public void updateStatusMessage(@RequestParam("user") String user, @RequestParam("partner") String partner) {
        messageRepository.markMessagesAsRead(user, partner);
    }

}


