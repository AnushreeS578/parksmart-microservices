package com.parksmart.booking_service.controller;

import com.parksmart.booking_service.entity.Booking;
import com.parksmart.booking_service.service.BookingService;
import com.parksmart.booking_service.dto.BookingRequestDTO;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
public class BookingController {

    private final BookingService service;

    // ✅ Constructor Injection
    public BookingController(BookingService service) {
        this.service = service;
    }

    // ✅ CONSTANT
    private static final String CANCEL_MSG = "Booking cancelled";

    // CREATE BOOKING (DTO)
    @PostMapping
    public Booking createBooking(@Valid @RequestBody BookingRequestDTO dto){

        Booking booking = new Booking();
        booking.setUserId(dto.getUserId());
        booking.setParkingId(dto.getParkingId());
        booking.setSlotNumber(dto.getSlotNumber());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());

        return service.createBooking(booking);
    }

    // GET ALL
    @GetMapping
    public List<Booking> getBookings(){
        return service.getBookings();
    }
    
    // GET BY ID
    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return service.getBookingById(id);
    }
    
    // CANCEL
    @DeleteMapping("/{id}")
    public String cancelBooking(@PathVariable Long id){
        service.cancelBooking(id);
        return CANCEL_MSG;
    }
    
}