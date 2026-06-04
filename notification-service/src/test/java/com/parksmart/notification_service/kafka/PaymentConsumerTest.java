package com.parksmart.notification_service.kafka;

import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.parksmart.common.dto.PaymentEvent;
import com.parksmart.notification_service.entity.Notification;
import com.parksmart.notification_service.repository.NotificationRepository;
import com.parksmart.notification_service.service.NotificationService;

@ExtendWith(MockitoExtension.class)
class PaymentConsumerTest {

    @Mock
    private NotificationService notificationService;

    @Mock
    private NotificationRepository repository;

    @InjectMocks
    private PaymentConsumer consumer;

    @Test
    void testConsume() {

        PaymentEvent event =
                new PaymentEvent();

        event.setPaymentId(1L);
        event.setBookingId(10L);
        event.setUserId(5L);
        event.setAmount(500);
        event.setPaymentMethod("UPI");
        event.setStatus("SUCCESS");
        event.setEmail("test@gmail.com");
        event.setPhone("+919999999999");

        consumer.consume(event);

        verify(notificationService,
                atLeastOnce())
                .sendNotification(any());

        verify(repository)
                .save(any(Notification.class));
    }
}
