package com.parksmart.notification_service.client;

import com.parksmart.notification_service.dto.NotificationRequestDTO;

import org.springframework.cloud.openfeign.FeignClient;

import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "EMAIL-SERVICE")
public interface EmailClient {

    @PostMapping("/email/send")
    String sendEmail(
        @RequestBody
        NotificationRequestDTO dto
    );
}
