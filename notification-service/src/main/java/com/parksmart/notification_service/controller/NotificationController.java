package com.parksmart.notification_service.controller;

import com.parksmart.notification_service.dto.NotificationRequestDTO;
import com.parksmart.notification_service.entity.Notification;
import com.parksmart.notification_service.repository.NotificationRepository;
import com.parksmart.notification_service.service.NotificationService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notify")
public class NotificationController {

    private final NotificationService service;

    private final NotificationRepository repository;

    public NotificationController(
            NotificationService service,
            NotificationRepository repository) {

        this.service = service;

        this.repository = repository;
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getUserNotifications(
            @PathVariable Long userId
    ) {

        if (userId <= 0) {

            throw new RuntimeException(
                    "Invalid User ID"
            );
        }

        return repository.findByUserId(userId);
    }

    @PutMapping("/read/{id}")
    public String markAsRead(
            @PathVariable Long id
    ) {

        if (id <= 0) {

            throw new RuntimeException(
                    "Invalid Notification ID"
            );
        }

        Notification notification =
                repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Notification Not Found"
                        )
                );

        notification.setStatus("READ");

        repository.save(notification);

        return "Notification Read ✅";
    }

    @PostMapping
    public String sendNotification(
            @Valid
            @RequestBody
            NotificationRequestDTO dto) {

        return service.sendNotification(dto);
    }
}