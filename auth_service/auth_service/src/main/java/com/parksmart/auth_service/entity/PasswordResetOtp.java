package com.parksmart.auth_service.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "password_reset_otp")
public class PasswordResetOtp {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String otp;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    
}
