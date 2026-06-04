package com.parksmart.parking_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHAndler {   // ✅ FIXED NAME

    // ✅ CONSTANT (Sonar fix)
    private static final String ERROR = "error";

    // NOT FOUND
    @ExceptionHandler(ParkingNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String,String> handleNotFound(ParkingNotFoundException ex){
        return Map.of(ERROR, ex.getMessage());
    }

    // ALREADY EXISTS
    @ExceptionHandler(ParkingAlreadyExistException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String,String> handleExists(ParkingAlreadyExistException ex){
        return Map.of(ERROR, ex.getMessage());
    }

    // VALIDATION ERROR
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String,String> handleValidation(MethodArgumentNotValidException ex){

        Map<String,String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));

        return errors;
    }

    // GENERIC ERROR
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String,String> handleAll(Exception ex){

        ex.printStackTrace(); // ✅ helpful for debugging

        return Map.of(ERROR, ex.getMessage()); // ✅ better than generic message
    }
}