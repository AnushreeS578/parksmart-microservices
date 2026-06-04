package com.parksmart.booking_service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequestDTO {

    @NotNull(message = "UserId required")
    private Long userId;

    @NotNull(message = "ParkingId required")
    private Long parkingId;

    @Positive(message = "Slot must be positive")
    private int slotNumber;

    @NotNull(message = "Start time required")
    private LocalDateTime startTime;

    @NotNull(message = "End time required")
    private LocalDateTime endTime;

	
}