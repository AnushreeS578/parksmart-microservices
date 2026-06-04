package com.parksmart.payment_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String ERROR = "error";

    // Booking not found
    @ExceptionHandler(BookingNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String,String> handleBookingException(BookingNotFoundException ex){
        return Map.of(ERROR, ex.getMessage());
    }

    // Payment errors
    @ExceptionHandler(PaymentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String,String> handlePayment(PaymentException ex){
        return Map.of(ERROR, ex.getMessage());
    }

    // Validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String,String> handleValidation(MethodArgumentNotValidException ex){

        Map<String,String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));

        return errors;
    }

    // Catch ALL
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String,String> handleAll(Exception ex){
        return Map.of(ERROR, "Something went wrong");
    }
}