package com.parksmart.notification_service.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;

import java.util.List;

import com.parksmart.notification_service.entity.Notification;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class NotificationRepositoryTest {

    @Autowired
    private NotificationRepository repository;

    @Test
    void testSaveNotification() {

        Notification notification =
                new Notification();

        notification.setUserId(1L);

        notification.setTitle(
                "Payment Success"
        );

        notification.setMessage(
                "Payment Done"
        );

        notification.setStatus(
                "UNREAD"
        );

        notification.setCreatedAt(
                LocalDateTime.now()
        );

        Notification saved =
                repository.save(
                        notification
                );

        assertEquals(
                "Payment Success",
                saved.getTitle()
        );
    }

    @Test
    void testFindByUserId() {

        Notification notification =
                new Notification();

        notification.setUserId(5L);

        notification.setTitle(
                "Test"
        );

        notification.setMessage(
                "Hello"
        );

        notification.setStatus(
                "UNREAD"
        );

        notification.setCreatedAt(
                LocalDateTime.now()
        );

        repository.save(notification);

        List<Notification> list =

                repository.findByUserId(5L);

        assertEquals(
                1,
                list.size()
        );
    }
}
