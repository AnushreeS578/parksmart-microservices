package com.parksmart.payment_service.client;

import com.parksmart.payment_service.dto.BookingDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "booking-service")
public interface BookingClient {

    @GetMapping("/booking/{id}")
    BookingDTO getBookingById(@PathVariable("id") Long id);

}
