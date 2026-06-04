package com.parksmart.notification_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.parksmart.notification_service.client.EmailClient;
import com.parksmart.notification_service.dto.NotificationRequestDTO;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class NotificationServiceTest {

    @Mock
    private EmailClient emailClient;

    @Mock
    private WhatsappService whatsappService;

    @InjectMocks
    private NotificationService notificationService;

    @BeforeEach
    void setup() {

        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendEmailNotification() {

        NotificationRequestDTO dto =
                new NotificationRequestDTO();

        dto.setTo(
                "test@gmail.com"
        );

        dto.setSubject(
                "Payment Success"
        );

        dto.setMessage(
                "Payment Done"
        );

        dto.setType(
                "EMAIL"
        );

        when(emailClient.sendEmail(dto))
                .thenReturn(
                        "Email Sent"
                );

        String result =
                notificationService
                        .sendNotification(dto);

        assertEquals(
                "Email Sent ✅",
                result
        );
    }

    @Test
    void testSendWhatsappNotification() {

        NotificationRequestDTO dto =
                new NotificationRequestDTO();

        dto.setTo(
                "+919999999999"
        );

        dto.setMessage(
                "Hello"
        );

        dto.setType(
                "WHATSAPP"
        );

        when(

                whatsappService.sendWhatsapp(
                        dto.getTo(),
                        dto.getMessage()
                )

        ).thenReturn(
                "WhatsApp Sent ✅"
        );

        String result =
                notificationService
                        .sendNotification(dto);

        assertEquals(
                "WhatsApp Sent ✅",
                result
        );
    }

    @Test
    void testInvalidNotificationType() {

        NotificationRequestDTO dto =
                new NotificationRequestDTO();

        dto.setType(
                "ABC"
        );

        String result =
                notificationService
                        .sendNotification(dto);

        assertEquals(
                "Invalid Notification Type ❌",
                result
        );
    }

    @Test
    void testNullNotification() {

        RuntimeException ex =

                assertThrows(

                        RuntimeException.class,

                        () -> notificationService
                                .sendNotification(null)
                );

        assertEquals(
                "Notification Request Cannot Be Null",
                ex.getMessage()
        );
    }
}
