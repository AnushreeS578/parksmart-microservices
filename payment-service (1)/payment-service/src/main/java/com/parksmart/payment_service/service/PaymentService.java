package com.parksmart.payment_service.service;

import com.parksmart.common.dto.PaymentEvent;
import com.parksmart.payment_service.client.BookingClient;


import com.parksmart.payment_service.dto.BookingDTO;
import com.parksmart.payment_service.dto.EmailRequestDTO;

import com.parksmart.payment_service.dto.PaymentVerificationDTO;
import com.parksmart.payment_service.dto.RazorpayOrderResponse;
import com.parksmart.payment_service.entity.Payment;
import com.parksmart.payment_service.exception.BookingNotFoundException;
import com.parksmart.payment_service.exception.PaymentException;
import com.parksmart.payment_service.kafka.PaymentProducer;
import com.parksmart.payment_service.repository.PaymentRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import org.json.JSONObject;

@Service
public class PaymentService {

    private static final Logger log =
            LoggerFactory.getLogger(
                    PaymentService.class
            );

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    @Value("${razorpay.key}")
    private String razorpayKey;

    private final PaymentRepository repository;
    
    private final PaymentProducer producer;

    private final BookingClient bookingClient;

    private final RazorpayClient razorpayClient;

   

    public PaymentService(
            PaymentRepository repository,
            PaymentProducer producer,
            BookingClient bookingClient,
            RazorpayClient razorpayClient
            ) {

        this.repository = repository;
        this.bookingClient = bookingClient;
        this.razorpayClient = razorpayClient;
        
        this.producer = producer;
    }

    // NORMAL PAYMENT
    public Payment createPayment(
            Payment payment) {

        if (payment == null) {

            throw new IllegalArgumentException(
                    "Payment data is required"
            );
        }

        if (payment.getBookingId() == null
                || payment.getBookingId() <= 0) {

            throw new BookingNotFoundException(
                    "Invalid Booking ID"
            );
        }

        if (payment.getPaymentMethod() == null
                || payment.getPaymentMethod().isBlank()) {

            throw new IllegalArgumentException(
                    "Payment method is required"
            );
        }

        // DUPLICATE CHECK
        if (repository.existsByBookingId(
                payment.getBookingId())) {

            throw new PaymentException(
                    "Payment already completed for this booking"
            );
        }

        BookingDTO booking;

        try {

            booking =
                    bookingClient.getBookingById(
                            payment.getBookingId()
                    );

        } catch (Exception e) {

            throw new BookingNotFoundException(
                    "Booking not found"
            );
        }

        if (booking == null) {

            throw new BookingNotFoundException(
                    "Booking not found"
            );
        }

        if (booking.getAmount() <= 0) {

            throw new IllegalArgumentException(
                    "Invalid booking amount"
            );
        }

        payment.setUserId(
                booking.getUserId()
        );

        payment.setAmount(
                booking.getAmount()
        );

        payment.setStatus("SUCCESS");

        payment.setPaymentTime(
                LocalDateTime.now()
        );

        log.info(
                "Payment successful for bookingId: {}",
                payment.getBookingId()
        );

        return repository.save(payment);
    }

    // GET ALL PAYMENTS
    public List<Payment> getPayments() {

        log.info("Fetching all payments");

        return repository.findAll();
    }

    // CREATE RAZORPAY ORDER
    public RazorpayOrderResponse createOrder(
            Long bookingId)
            throws Exception {

        // DUPLICATE CHECK
        if(repository.existsByBookingId(
                bookingId)) {

            throw new PaymentException(
                    "Payment already completed for this booking"
            );
        }

        BookingDTO booking =
                bookingClient.getBookingById(
                        bookingId
                );

        if (booking == null) {

            throw new BookingNotFoundException(
                    "Booking not found"
            );
        }

        JSONObject options =
                new JSONObject();

        options.put(
                "amount",
                booking.getAmount() * 100
        );

        options.put(
                "currency",
                "INR"
        );

        options.put(
                "receipt",
                "txn_" + bookingId
        );

        Order order =
                razorpayClient.orders
                        .create(options);

        RazorpayOrderResponse response =
                new RazorpayOrderResponse();

        response.setOrderId(
                order.get("id")
        );

        response.setAmount(
                booking.getAmount()
        );

        response.setCurrency(
                order.get("currency")
        );

        response.setKey(
                razorpayKey
        );

        return response;
    }

 // VERIFY PAYMENT
    public Payment verifyPayment(
            PaymentVerificationDTO dto)
            throws Exception {

        // AVOID DUPLICATE PAYMENT
        if(repository.existsByBookingId(
                dto.getBookingId())) {

            throw new PaymentException(
                    "Payment already completed for this booking"
            );
        }

        // VERIFY SIGNATURE
        JSONObject options =
                new JSONObject();

        options.put(
                "razorpay_order_id",
                dto.getRazorpayOrderId()
        );

        options.put(
                "razorpay_payment_id",
                dto.getRazorpayPaymentId()
        );

        options.put(
                "razorpay_signature",
                dto.getRazorpaySignature()
        );

        boolean isValid =
                Utils.verifyPaymentSignature(
                        options,
                        razorpaySecret
                );

        if (!isValid) {

            throw new PaymentException(
                    "Invalid payment"
            );
        }

        // FETCH BOOKING
        BookingDTO booking =
                bookingClient.getBookingById(
                        dto.getBookingId()
                );

        // CREATE PAYMENT
        Payment payment =
                new Payment();

        payment.setBookingId(
                booking.getId()
        );

        payment.setUserId(
                booking.getUserId()
        );

        payment.setAmount(
                booking.getAmount()
        );

        payment.setPaymentMethod("UPI");

        payment.setStatus("SUCCESS");

        payment.setRazorpayOrderId(
                dto.getRazorpayOrderId()
        );

        payment.setRazorpayPaymentId(
                dto.getRazorpayPaymentId()
        );

        payment.setPaymentTime(
                LocalDateTime.now()
        );

        // SAVE PAYMENT
        Payment savedPayment =
                repository.save(payment);

        // CREATE PAYMENT EVENT
        PaymentEvent event =
                new PaymentEvent();

        event.setPaymentId(
                savedPayment.getId()
        );

        event.setBookingId(
                savedPayment.getBookingId()
        );

        event.setUserId(
                savedPayment.getUserId()
        );

        event.setAmount(
                savedPayment.getAmount()
        );

        event.setPaymentMethod(
                savedPayment.getPaymentMethod()
        );

        event.setStatus(
                savedPayment.getStatus()
        );

        // YOUR EMAIL
        event.setEmail(
                "anushrees7176@gmail.com"
        );

        // YOUR PHONE
        event.setPhone(
                "+918951767176"
        );

        // SEND EVENT TO KAFKA
        producer.sendPaymentEvent(
                event
        );

        return savedPayment;
    }
    
    public List<Payment> getPaymentsByUserId(
            Long userId
    ){
        return repository.findByUserId(userId);
    }
}