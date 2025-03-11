package com.bezkoder.springjwt.notification;

import com.bezkoder.springjwt.payload.response.ResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationProducer {
    private final KafkaTemplate<String, ResultResponse> kafkaTemplate;
    public void sendNotification(ResultResponse response)
    {
        Message<ResultResponse> message = MessageBuilder
                .withPayload(response)
                .setHeader(KafkaHeaders.TOPIC,"request-to-seller-topic")
                .build();
        kafkaTemplate.send(message);
    }
}
