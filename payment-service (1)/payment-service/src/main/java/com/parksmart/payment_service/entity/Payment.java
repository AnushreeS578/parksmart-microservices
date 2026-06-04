package com.parksmart.payment_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long bookingId;

    private Long userId;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private String paymentMethod; // UPI / CARD

    private String status;
    
    private String razorpayOrderId;
    
    private String razorpayPaymentId;

    private LocalDateTime paymentTime;
}