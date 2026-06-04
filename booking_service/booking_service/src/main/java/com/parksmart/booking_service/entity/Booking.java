package com.parksmart.booking_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.Data;

@Entity
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "UserId cannot be null")
    private Long userId;

    @NotNull(message = "ParkingId cannot be null")
    private Long parkingId;

    @Positive(message = "Slot number must be positive")
    private int slotNumber;

    // ✅ Auto-set booking time
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime bookingTime;

    // ✅ restrict values
    private String status;

    @NotNull(message="Start time required")
    @FutureOrPresent(message = "Start time must be present or future")
    private LocalDateTime startTime;

    @NotNull(message="End time required")
    @Future(message = "End time must be future")
    private LocalDateTime endTime;
    
    private double amount;

  
	// ✅ Automatically set bookingTime before insert
    @PrePersist
    public void prePersist() {
        this.bookingTime = LocalDateTime.now();
        if (this.status == null) {
            this.status = "BOOKED";
        }
    }

	
}