package com.parksmart.notification_service.service;

import com.parksmart.notification_service.client.EmailClient;
import com.parksmart.notification_service.dto.NotificationRequestDTO;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final EmailClient emailClient;

    private final WhatsappService whatsappService;

    public NotificationService(
            EmailClient emailClient,
            WhatsappService whatsappService) {

        this.emailClient = emailClient;

        this.whatsappService = whatsappService;
    }

    public String sendNotification(
            NotificationRequestDTO dto) {

        if (dto == null) {

            throw new RuntimeException(
                    "Notification Request Cannot Be Null"
            );
        }

        String type = dto.getType();

        try {

            // EMAIL
            if ("EMAIL".equalsIgnoreCase(type)) {

                if (dto.getSubject() == null
                        || dto.getSubject().isBlank()) {

                    throw new RuntimeException(
                            "Email Subject Cannot Be Empty"
                    );
                }

                emailClient.sendEmail(dto);

                return "Email Sent ✅";
            }

            // WHATSAPP
            if ("WHATSAPP".equalsIgnoreCase(type)) {

                return whatsappService.sendWhatsapp(
                        dto.getTo(),
                        dto.getMessage()
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "NOTIFICATION ERROR = "
                    + e.getMessage()
            );

            e.printStackTrace();

            return "Notification Failed ❌";
        }

        return "Invalid Notification Type ❌";
    }
}