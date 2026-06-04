package com.parksmart.payment_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.parksmart.payment_service.dto.PaymentRequestDTO;
import com.parksmart.payment_service.entity.Payment;
import com.parksmart.payment_service.service.PaymentService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
@AutoConfigureMockMvc(addFilters = false) // 🔥 IMPORTANT
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PaymentService service;

    @Autowired
    private ObjectMapper objectMapper;

    // ✅ CREATE PAYMENT
    @Test
    void testMakePayment() throws Exception {

        PaymentRequestDTO dto = new PaymentRequestDTO();
        dto.setBookingId(1L);
        dto.setPaymentMethod("UPI");

        Payment payment = new Payment();
        payment.setId(1L);

        when(service.createPayment(any())).thenReturn(payment);

        mockMvc.perform(post("/payment")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    // ✅ GET PAYMENTS
    @Test
    void testGetPayments() throws Exception {

        when(service.getPayments()).thenReturn(List.of(new Payment()));

        mockMvc.perform(get("/payment"))
                .andExpect(status().isOk());
    }
}