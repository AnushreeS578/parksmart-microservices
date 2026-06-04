package com.parksmart.email_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class EmailRequestDTO {

    @Email(message = "Invalid Email")
    @NotBlank(message = "Email Cannot Be Empty")
    private String to;

    @NotBlank(message = "Subject Cannot Be Empty")
    private String subject;

    @NotBlank(message = "Message Cannot Be Empty")
    private String message;
}