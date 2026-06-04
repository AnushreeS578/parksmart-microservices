package com.parksmart.payment_service.kafka;



import org.springframework.kafka.core.KafkaTemplate;

import org.springframework.stereotype.Service;

import com.parksmart.common.dto.PaymentEvent;

@Service
public class PaymentProducer {

    private final KafkaTemplate<String, Object>
            kafkaTemplate;

    public PaymentProducer(

        KafkaTemplate<String, Object>
                kafkaTemplate) {

        this.kafkaTemplate =
                kafkaTemplate;
    }

    public void sendPaymentEvent(
            PaymentEvent event) {

        kafkaTemplate.send(
                "payment-topic",
                event
        );

        System.out.println(
            "Payment Event Sent 🔥"
        );
    }
}
