package com.parksmart.parking_service.exception;

public class ParkingAlreadyExistException extends RuntimeException {

    public ParkingAlreadyExistException(String message) {
        super(message);
    }
}