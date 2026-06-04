package com.parksmart.auth_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String ERROR = "error"; // ✅ FIXED

    // Custom Exception
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleUserNotFound(UserNotFoundException ex) {

        Map<String, String> error = new HashMap<>();
        error.put(ERROR, ex.getMessage());
        return error;
    }

    // Validation Exception
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidation(MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(err ->
                errors.put(err.getField(), err.getDefaultMessage())
        );

        return errors;
    }

    // Fallback
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleAll(Exception ex) {

        Map<String, String> error = new HashMap<>();
        error.put(ERROR, "Something went wrong");
        return error;
    }
}