package com.parksmart.notification_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(
            strategy =
            GenerationType.IDENTITY
    )
    private Long id;

    @NotNull(
            message =
            "User ID cannot be null"
    )
    private Long userId;

    @NotBlank(
            message =
            "Title cannot be empty"
    )
    @Size(
            min = 3,
            max = 100,
            message =
            "Title must be between 3 and 100 characters"
    )
    private String title;

    @NotBlank(
            message =
            "Message cannot be empty"
    )
    @Size(
            min = 5,
            max = 500,
            message =
            "Message must be between 5 and 500 characters"
    )
    private String message;

    @NotBlank(
            message =
            "Status cannot be empty"
    )
    private String status;

    @NotNull(
            message =
            "Created time cannot be null"
    )
    private LocalDateTime createdAt;

    
}