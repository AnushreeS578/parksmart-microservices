package com.parksmart.notification_service.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class NotificationRequestDTO {

    @NotBlank(message = "Receiver cannot be empty")
    private String to;

    private String subject;

    @NotBlank(message = "Message cannot be empty")
    private String message;

    @NotBlank(message = "Type cannot be empty")
    private String type;
}
