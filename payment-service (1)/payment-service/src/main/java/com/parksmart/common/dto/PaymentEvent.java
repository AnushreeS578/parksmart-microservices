package com.parksmart.common.dto;


import lombok.Data;

@Data
public class PaymentEvent {

    private Long paymentId;

    private Long bookingId;

    private Long userId;

    private double amount;

    private String paymentMethod;

    private String status;

    private String email;

    private String phone;
}
