package com.parksmart.payment_service.controller;

import com.parksmart.payment_service.dto.PaymentRequestDTO;
import com.parksmart.payment_service.dto.PaymentVerificationDTO;
import com.parksmart.payment_service.dto.RazorpayOrderResponse;
import com.parksmart.payment_service.entity.Payment;
import com.parksmart.payment_service.service.PaymentService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping
    public Payment makePayment(@Valid @RequestBody PaymentRequestDTO dto){

        Payment payment = new Payment();
        payment.setBookingId(dto.getBookingId());
        payment.setPaymentMethod(dto.getPaymentMethod());

        return service.createPayment(payment);
    }
    
    @PostMapping("/create-order/{bookingId}")
    public RazorpayOrderResponse createOrder(
            @PathVariable Long bookingId) throws Exception {

        return service.createOrder(bookingId);
    }
    
    @PostMapping("/verify")
    public Payment verifyPayment(
            @RequestBody PaymentVerificationDTO dto)
            throws Exception {

        return service.verifyPayment(dto);
    }

    @GetMapping
    public List<Payment> getPayments(){
        return service.getPayments();
    }
    
    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentsByUserId(
            @PathVariable Long userId
    ){
        return service.getPaymentsByUserId(userId);
    }
}