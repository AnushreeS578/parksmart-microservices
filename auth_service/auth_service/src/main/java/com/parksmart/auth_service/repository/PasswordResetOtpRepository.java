package com.parksmart.auth_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parksmart.auth_service.entity.PasswordResetOtp;

public interface PasswordResetOtpRepository
        extends JpaRepository<
                PasswordResetOtp,
                Long> {

    Optional<PasswordResetOtp>
    findByUsername(String username);

    void deleteByUsername(
            String username
    );
}
