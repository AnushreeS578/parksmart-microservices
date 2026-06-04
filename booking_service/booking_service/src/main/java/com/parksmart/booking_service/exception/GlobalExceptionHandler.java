package com.parksmart.booking_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String ERROR = "error";
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BookingNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String,String> handleBookingNotFound(BookingNotFoundException ex){
        return Map.of(ERROR, ex.getMessage());
    }

    @ExceptionHandler(SlotAlreadyBookedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String,String> handleSlot(SlotAlreadyBookedException ex){
        return Map.of(ERROR, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String,String> handleIllegalArgument(IllegalArgumentException ex){
        return Map.of(ERROR, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String,String> handleValidation(MethodArgumentNotValidException ex){

        Map<String,String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));

        return errors;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String,String> handleAll(Exception ex){

        log.error("Unhandled exception", ex);

        return Map.of(ERROR, "Something went wrong");
    }
}