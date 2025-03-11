package com.example.chat_service.repository.custom;

import com.example.chat_service.entity.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

@Repository
public class CustomMessageRepositoryImpl implements CustomMessageRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void markMessagesAsRead(String receiver, String sender) {
        Query query = new Query();
        query.addCriteria(Criteria.where("receiver").is(receiver)
                .and("sender").is(sender)
                .and("isReaded").is(false));
        Update update = new Update().set("isReaded", true);
        mongoTemplate.updateMulti(query, update, ChatMessage.class);
    }
}