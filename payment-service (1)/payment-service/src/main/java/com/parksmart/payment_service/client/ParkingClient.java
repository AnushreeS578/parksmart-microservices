package com.parksmart.payment_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.parksmart.payment_service.dto.ParkingDTO;

@FeignClient(name = "parking-service")
public interface ParkingClient {

    @GetMapping("/parking/{id}")
    ParkingDTO getParkingById(@PathVariable Long id);
}
