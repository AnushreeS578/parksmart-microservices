package com.parksmart.booking_service.client;



import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.parksmart.booking_service.dto.ParkingDTO;

@FeignClient(name = "parking-service")
public interface ParkingClient {

    // GET PARKING
    @GetMapping("/parking/{id}")
    ParkingDTO getParkingById(@PathVariable("id") Long id);

    // REDUCE SLOT AFTER BOOKING
    @PutMapping("/parking/reduce/{id}")
    void reduceSlot(@PathVariable("id") Long id);

    // INCREASE SLOT AFTER CANCEL
    @PutMapping("/parking/increase/{id}")
    void increaseSlot(@PathVariable("id") Long id);
}