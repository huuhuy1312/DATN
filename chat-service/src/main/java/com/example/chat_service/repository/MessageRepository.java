package com.example.chat_service.repository;

import com.example.chat_service.entity.ChatMessage;
import com.example.chat_service.repository.custom.CustomMessageRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface MessageRepository extends MongoRepository<ChatMessage, String>, CustomMessageRepository {

    @Query("{ '$or': [ { 'receiver': ?0 }, { 'sender': ?0 } ] }")
    List<ChatMessage> findDistinctReceiversAndSenders(String user);

    @Query("{ 'receiver': ?0, 'sender': ?1, 'isReaded': false }")
    List<ChatMessage> findUnreadMessages(String receiver, String sender);

    @Query("{ '$or': [ { 'receiver': ?0, 'sender': ?1 }, { 'receiver': ?1, 'sender': ?0 } ] }")
    List<ChatMessage> findMessagesBetweenUsers(String user1, String user2);



}

