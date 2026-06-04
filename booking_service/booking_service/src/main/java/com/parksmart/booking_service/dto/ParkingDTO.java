package com.parksmart.booking_service.dto;

import lombok.Data;

@Data   
public class ParkingDTO {

    private Long id;
    private String location;
    private int availableSlots;
    private int pricePerHour;
}