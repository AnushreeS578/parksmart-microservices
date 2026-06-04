package com.parksmart.payment_service.dto;

import lombok.Data;

@Data
public class ParkingDTO {

    private Long id;
    private String location;
    private int totalSlots;
    private int availableSlots;
    private double pricePerHour;
	
}
