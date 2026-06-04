package com.parksmart.notification_service.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;

import org.springframework.web.bind.annotation.ExceptionHandler;

import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<
            Map<String, String>
            > handleValidation(

            MethodArgumentNotValidException ex) {

        Map<String, String> errors =
                new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->

                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return new ResponseEntity<>(
                errors,
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(
            RuntimeException.class
    )
    public ResponseEntity<String>
    handleRuntime(

            RuntimeException ex) {

        return new ResponseEntity<>(

                ex.getMessage(),

                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(
            Exception.class
    )
    public ResponseEntity<String>
    handleException(

            Exception ex) {

        return new ResponseEntity<>(

                "Something Went Wrong ❌",

                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
