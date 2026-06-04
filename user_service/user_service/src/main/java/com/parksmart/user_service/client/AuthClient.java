package com.parksmart.user_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "AUTH-SERVICE")//call auth service without writing rest code manually
public interface AuthClient {

    @GetMapping("/auth/validate")
    String validateUser(@RequestParam String username);
}
