package com.parksmart.auth_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String otp;

    @Size(
            min = 6,
            message =
            "Password minimum 6 characters"
    )
    private String newPassword;

    public String getUsername() {
        return username;
    }

    public void setUsername(
            String username) {

        this.username = username;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(
            String otp) {

        this.otp = otp;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(
            String newPassword) {

        this.newPassword = newPassword;
    }
}
