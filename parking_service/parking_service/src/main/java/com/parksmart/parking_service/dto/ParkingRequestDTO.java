package com.parksmart.parking_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ParkingRequestDTO {

    @NotBlank(message = "Location required")
    private String location;

    @Min(value = 1, message = "Total slots must be > 0")
    private int totalSlots;

    @Min(value = 0, message = "Available slots cannot be negative")
    private int availableSlots;
    
    @Min(value = 1, message = "Price per hour must be positive")
    private double pricePerHour;

	
}
