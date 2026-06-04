package com.parksmart.auth_service.dto;

import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {

    @NotBlank(
            message =
            "Username required"
    )
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(
            String username) {

        this.username = username;
    }
}
