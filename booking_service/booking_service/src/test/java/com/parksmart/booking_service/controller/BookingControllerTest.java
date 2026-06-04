package com.parksmart.booking_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.parksmart.booking_service.dto.BookingRequestDTO;
import com.parksmart.booking_service.entity.Booking;
import com.parksmart.booking_service.service.BookingService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingController.class)
@AutoConfigureMockMvc(addFilters = false)   // 🔥 THIS FIXES 403
class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookingService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateBooking() throws Exception {

        BookingRequestDTO dto = new BookingRequestDTO();
        dto.setUserId(1L);
        dto.setParkingId(1L);
        dto.setSlotNumber(1);
        dto.setStartTime(LocalDateTime.now().plusHours(1));
        dto.setEndTime(LocalDateTime.now().plusHours(3));

        Booking booking = new Booking();
        booking.setId(1L);

        when(service.createBooking(any())).thenReturn(booking);

        mockMvc.perform(post("/booking")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void testGetBookings() throws Exception {

        when(service.getBookings()).thenReturn(List.of(new Booking()));

        mockMvc.perform(get("/booking"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetBookingById() throws Exception {

        when(service.getBookingById(1L)).thenReturn(new Booking());

        mockMvc.perform(get("/booking/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testCancelBooking() throws Exception {

        doNothing().when(service).cancelBooking(1L);

        mockMvc.perform(delete("/booking/1"))
                .andExpect(status().isOk());
    }
}