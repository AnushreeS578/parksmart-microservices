package com.parksmart.notification_service.kafka;

import com.parksmart.common.dto.PaymentEvent;
import com.parksmart.notification_service.dto.NotificationRequestDTO;
import com.parksmart.notification_service.entity.Notification;
import com.parksmart.notification_service.repository.NotificationRepository;
import com.parksmart.notification_service.service.NotificationService;

import java.time.LocalDateTime;

import org.springframework.kafka.annotation.KafkaListener;

import org.springframework.stereotype.Service;

@Service
public class PaymentConsumer {

    private final NotificationService
            notificationService;
    private final NotificationRepository
    notificationRepository;

    public PaymentConsumer(

            NotificationService
                    notificationService,

            NotificationRepository
                    notificationRepository) {

        this.notificationService =
                notificationService;

        this.notificationRepository =
                notificationRepository;
    }

    @KafkaListener(
        topics = "payment-topic",
        groupId = "notification-group"
    )
    public void consume(
            PaymentEvent event) {

        System.out.println(
            "PAYMENT EVENT RECEIVED 🔥"
        );

        String message =

                "🚗 ParkSmart Payment Successful ✅\n\n"

                + "Payment ID: "
                + event.getPaymentId()

                + "\nBooking ID: "
                + event.getBookingId()

                + "\nUser ID: "
                + event.getUserId()

                + "\nAmount Paid: ₹"
                + event.getAmount()

                + "\nPayment Method: "
                + event.getPaymentMethod()

                + "\nStatus: "
                + event.getStatus()

                + "\n\nThank you for using ParkSmart 🚗";

        // EMAIL
        NotificationRequestDTO email =
                new NotificationRequestDTO();

        email.setTo(
                event.getEmail()
        );

        email.setSubject(
                "ParkSmart Payment Successful"
        );

        email.setMessage(
                message
        );

        email.setType(
                "EMAIL"
        );

        notificationService
                .sendNotification(email);

        // SMS
        /*NotificationRequestDTO sms =
                new NotificationRequestDTO();
        
        System.out.println(
        	    "SMS PHONE = "
        	    + event.getPhone()
        	);

        sms.setTo(
        		"+917338667955"  
        );

        sms.setMessage(
                message
        );

        sms.setType(
                "SMS"
        );

        notificationService
                .sendNotification(sms);*/

     // WHATSAPP
        NotificationRequestDTO whatsapp =
                new NotificationRequestDTO();

        System.out.println(
            "PHONE = "
            + event.getPhone()
        );

        whatsapp.setTo(
        		"+918951767176"
        );

        whatsapp.setMessage(
                message
        );

        whatsapp.setType(
                "WHATSAPP"
        );

        notificationService
                .sendNotification(
                        whatsapp
                );
        
        Notification notification =
                new Notification();

        notification.setUserId(
                event.getUserId()
        );

        notification.setTitle(
                "Payment Successful"
        );

        notification.setMessage(
                message
        );

        notification.setStatus(
                "UNREAD"
        );

        notification.setCreatedAt(
                LocalDateTime.now()
        );

        notificationRepository.save(
                notification
        );

        System.out.println(
                "Notification Saved In DB ✅"
        );
    }
}
