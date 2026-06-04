package com.parksmart.user_service.exception;   // change package per service

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //Validation Errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidation(MethodArgumentNotValidException ex){

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return errors;
    }

    //Custom Exception (Example)
    @ExceptionHandler(UserProfileNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleUserNotFound(UserProfileNotFoundException ex){

        return Map.of("error", ex.getMessage());
    }

    //Fallback Exception (VERY IMPORTANT)
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleAll(Exception ex) {

        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());   // ✅ SHOW REAL ERROR

        ex.printStackTrace();  // ✅ VERY IMPORTANT (prints in console)

        return error;
    }
}