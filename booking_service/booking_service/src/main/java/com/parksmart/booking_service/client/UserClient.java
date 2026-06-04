package com.parksmart.booking_service.client;


import com.parksmart.booking_service.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/users/id/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);

}
