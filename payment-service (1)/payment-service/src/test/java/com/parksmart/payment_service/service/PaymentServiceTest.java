package com.parksmart.payment_service.service;

import com.parksmart.common.dto.PaymentEvent;
import com.parksmart.payment_service.client.BookingClient;
import com.parksmart.payment_service.dto.BookingDTO;
import com.parksmart.payment_service.dto.PaymentVerificationDTO;
import com.parksmart.payment_service.dto.RazorpayOrderResponse;
import com.parksmart.payment_service.entity.Payment;
import com.parksmart.payment_service.exception.BookingNotFoundException;
import com.parksmart.payment_service.exception.PaymentException;
import com.parksmart.payment_service.kafka.PaymentProducer;
import com.parksmart.payment_service.repository.PaymentRepository;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import org.json.JSONObject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository repository;

    @Mock
    private PaymentProducer producer;

    @Mock
    private BookingClient bookingClient;

    @Mock
    private RazorpayClient razorpayClient;

    @Mock
    private Order order;

    @InjectMocks
    private PaymentService service;

    private Payment payment;

    private BookingDTO booking;

    @BeforeEach
    void setUp() {

        ReflectionTestUtils.setField(
                service,
                "razorpaySecret",
                "secret"
        );

        ReflectionTestUtils.setField(
                service,
                "razorpayKey",
                "rzp_test"
        );

        payment = new Payment();

        payment.setBookingId(1L);

        payment.setPaymentMethod("CARD");

        booking = new BookingDTO();

        booking.setId(1L);

        booking.setUserId(10L);

        booking.setAmount(500);
    }

    // CREATE PAYMENT SUCCESS
    @Test
    void testCreatePayment() {

        when(repository.existsByBookingId(1L))
                .thenReturn(false);

        when(bookingClient.getBookingById(1L))
                .thenReturn(booking);

        when(repository.save(any(Payment.class)))
                .thenReturn(payment);

        Payment result =
                service.createPayment(payment);

        assertNotNull(result);

        verify(repository, times(1))
                .save(any(Payment.class));
    }

    // NULL PAYMENT
    @Test
    void testCreatePayment_NullPayment() {

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.createPayment(null)
                );

        assertEquals(
                "Payment data is required",
                ex.getMessage()
        );
    }

    // INVALID BOOKING ID
    @Test
    void testInvalidBookingId() {

        payment.setBookingId(0L);

        assertThrows(
                BookingNotFoundException.class,
                () -> service.createPayment(payment)
        );
    }

    // DUPLICATE PAYMENT
    @Test
    void testDuplicatePayment() {

        when(repository.existsByBookingId(1L))
                .thenReturn(true);

        assertThrows(
                PaymentException.class,
                () -> service.createPayment(payment)
        );
    }

    // BOOKING NOT FOUND
    @Test
    void testBookingNotFound() {

        when(repository.existsByBookingId(1L))
                .thenReturn(false);

        when(bookingClient.getBookingById(1L))
                .thenThrow(
                        new RuntimeException()
                );

        assertThrows(
                BookingNotFoundException.class,
                () -> service.createPayment(payment)
        );
    }

    // GET PAYMENTS
    @Test
    void testGetPayments() {

        List<Payment> list =
                Arrays.asList(payment);

        when(repository.findAll())
                .thenReturn(list);

        List<Payment> result =
                service.getPayments();

        assertEquals(1, result.size());
    }

    // GET PAYMENTS BY USER ID
    @Test
    void testGetPaymentsByUserId() {

        List<Payment> list =
                Arrays.asList(payment);

        when(repository.findByUserId(10L))
                .thenReturn(list);

        List<Payment> result =
                service.getPaymentsByUserId(10L);

        assertEquals(1, result.size());
    }

    // CREATE ORDER SUCCESS
    @Test
    void testCreateOrder()
            throws Exception {

        when(repository.existsByBookingId(1L))
                .thenReturn(false);

        when(bookingClient.getBookingById(1L))
                .thenReturn(booking);

        when(order.get("id"))
                .thenReturn("order_123");

        when(order.get("currency"))
                .thenReturn("INR");

        // MOCK ORDER CLIENT
        com.razorpay.OrderClient
                orderClient =
                mock(com.razorpay.OrderClient.class);

        // SET MOCK INTO RAZORPAY CLIENT
        razorpayClient.orders =
                orderClient;

        when(orderClient.create(
                any(JSONObject.class)
        )).thenReturn(order);

        RazorpayOrderResponse response =
                service.createOrder(1L);

        assertNotNull(response);

        assertEquals(
                "order_123",
                response.getOrderId()
        );
    }

    // DUPLICATE ORDER
    @Test
    void testCreateOrder_Duplicate() {

        when(repository.existsByBookingId(1L))
                .thenReturn(true);

        assertThrows(
                PaymentException.class,
                () -> service.createOrder(1L)
        );
    }

    // VERIFY PAYMENT DUPLICATE
    @Test
    void testVerifyPayment_Duplicate() {

        PaymentVerificationDTO dto =
                new PaymentVerificationDTO();

        dto.setBookingId(1L);

        when(repository.existsByBookingId(1L))
                .thenReturn(true);

        assertThrows(
                PaymentException.class,
                () -> service.verifyPayment(dto)
        );
    }

    // VERIFY PAYMENT INVALID SIGNATURE
    @Test
    void testVerifyPayment_InvalidSignature() {

        PaymentVerificationDTO dto =
                new PaymentVerificationDTO();

        dto.setBookingId(1L);

        dto.setRazorpayOrderId("order");

        dto.setRazorpayPaymentId("payment");

        dto.setRazorpaySignature("wrong");

        when(repository.existsByBookingId(1L))
                .thenReturn(false);

        assertThrows(
                Exception.class,
                () -> service.verifyPayment(dto)
        );
    }

    // SAVE PAYMENT SUCCESS
    @Test
    void testSavePayment() {

        when(repository.save(any(Payment.class)))
                .thenReturn(payment);

        Payment saved =
                repository.save(payment);

        assertNotNull(saved);
    }

    // PRODUCER TEST
    @Test
    void testProducerSendEvent() {

        PaymentEvent event =
                new PaymentEvent();

        producer.sendPaymentEvent(event);

        verify(producer, times(1))
                .sendPaymentEvent(event);
    }
}