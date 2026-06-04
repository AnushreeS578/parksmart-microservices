package com.parksmart.payment_service.exception;



public class BookingNotFoundException extends RuntimeException {

    public BookingNotFoundException(String message) {
        super(message);
    }
}
