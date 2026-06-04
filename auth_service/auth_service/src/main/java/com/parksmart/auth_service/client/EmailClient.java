package com.parksmart.auth_service.client;

import com.parksmart.auth_service.dto.EmailRequestDTO;

import org.springframework.cloud.openfeign.FeignClient;

import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "EMAIL-SERVICE")
public interface EmailClient {

    @PostMapping("/email/send")
    String sendEmail(
            @RequestBody
            EmailRequestDTO dto
    );
}
