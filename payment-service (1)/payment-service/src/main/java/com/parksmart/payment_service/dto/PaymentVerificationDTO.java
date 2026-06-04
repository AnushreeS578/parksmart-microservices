package com.parksmart.payment_service.dto;

import lombok.Data;

@Data
public class PaymentVerificationDTO {

    private Long bookingId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
