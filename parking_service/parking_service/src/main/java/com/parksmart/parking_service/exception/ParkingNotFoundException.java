package com.parksmart.parking_service.exception;

public class ParkingNotFoundException extends RuntimeException {

    public ParkingNotFoundException(String message) {
        super(message);
    }
}