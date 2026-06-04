package com.parksmart.email_service.controller;

import com.parksmart.email_service.dto.EmailRequestDTO;
import com.parksmart.email_service.service.EmailService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class EmailController {

    private final EmailService service;

    public EmailController(
            EmailService service) {

        this.service = service;
    }

    @PostMapping("/send")
    public String sendEmail(
            @Valid
            @RequestBody
            EmailRequestDTO dto) {

        return service.sendEmail(dto);
    }
}