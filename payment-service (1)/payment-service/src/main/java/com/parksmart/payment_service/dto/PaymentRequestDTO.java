package com.parksmart.payment_service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PaymentRequestDTO {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Payment method required")
    private String paymentMethod;

    
    
}
