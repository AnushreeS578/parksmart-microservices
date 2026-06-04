package com.parksmart.parking_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Data
public class Parking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Location required")
    private String location;

    @Positive(message = "Total slots must be positive")
    private int totalSlots;

    @Min(value = 0, message = "Available slots cannot be negative")
    private int availableSlots;
    
    @Positive(message = "Price per hour must be positive")
    private double pricePerHour;

   
	

}
