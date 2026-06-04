package com.parksmart.payment_service.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class BookingDTO {

    private Long id;
    private Long userId;
    private Long parkingId;
    private int slotNumber;
    private String status;
    private int amount;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;
   
	
}