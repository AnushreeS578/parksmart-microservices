package com.parksmart.parking_service.service;

import com.parksmart.parking_service.entity.Parking;
import com.parksmart.parking_service.repository.ParkingRepository;
import com.parksmart.parking_service.exception.*;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingService {

    private final ParkingRepository repository;

    public ParkingService(ParkingRepository repository) {
        this.repository = repository;
    }

    private static final String PARKING_NOT_FOUND = "Parking not found";

    // ✅ ADD PARKING
    public Parking addParking(Parking parking){

        if(parking == null){
            throw new IllegalArgumentException("Parking data is required");
        }

        if(parking.getLocation() == null || parking.getLocation().isBlank()){
            throw new IllegalArgumentException("Location is required");
        }

        if(parking.getTotalSlots() <= 0){
            throw new IllegalArgumentException("Total slots must be greater than 0");
        }

        if(parking.getAvailableSlots() < 0){
            throw new IllegalArgumentException("Available slots cannot be negative");
        }

        if(parking.getAvailableSlots() > parking.getTotalSlots()){
            throw new IllegalArgumentException("Available slots cannot exceed total slots");
        }

        if(repository.existsByLocation(parking.getLocation())){
            throw new ParkingAlreadyExistException("Parking location already exists");
        }

        return repository.save(parking);
    }

    // ✅ GET BY ID
    public Parking getParkingById(Long id){

        if(id == null || id <= 0){
            throw new IllegalArgumentException("Invalid parking ID");
        }

        return repository.findById(id)
                .orElseThrow(() -> new ParkingNotFoundException(PARKING_NOT_FOUND));
    }

    // ✅ GET ALL
    public List<Parking> getParking(){
        return repository.findAll();
    }

    // ✅ UPDATE
    public Parking updateParking(Long id, Parking parking){

        if(id == null || id <= 0){
            throw new IllegalArgumentException("Invalid parking ID");
        }

        Parking existing = repository.findById(id)
                .orElseThrow(() -> new ParkingNotFoundException(PARKING_NOT_FOUND));

        if(parking.getLocation() != null && !parking.getLocation().isBlank()){
            existing.setLocation(parking.getLocation());
        }

        if(parking.getTotalSlots() > 0){
            existing.setTotalSlots(parking.getTotalSlots());
        }

        if(parking.getAvailableSlots() >= 0){
            if(parking.getAvailableSlots() > existing.getTotalSlots()){
                throw new IllegalArgumentException("Available slots cannot exceed total slots");
            }
            existing.setAvailableSlots(parking.getAvailableSlots());
        }

        return repository.save(existing);
    }
    
    // ✅ REDUCE SLOT
    public void reduceSlot(Long id){

        if(id == null || id <= 0){
            throw new IllegalArgumentException("Invalid parking ID");
        }

        Parking p = repository.findById(id)
                .orElseThrow(() -> new ParkingNotFoundException(PARKING_NOT_FOUND));

        if(p.getAvailableSlots() <= 0){
            throw new IllegalStateException("No slots available");
        }

        p.setAvailableSlots(p.getAvailableSlots() - 1);
        repository.save(p);
    }
    
    // ✅ INCREASE SLOT
    public void increaseSlot(Long id){

        if(id == null || id <= 0){
            throw new IllegalArgumentException("Invalid parking ID");
        }

        Parking p = repository.findById(id)
                .orElseThrow(() -> new ParkingNotFoundException(PARKING_NOT_FOUND));

        if(p.getAvailableSlots() >= p.getTotalSlots()){
            throw new IllegalStateException("Slots already full");
        }

        p.setAvailableSlots(p.getAvailableSlots() + 1);
        repository.save(p);
    }

    // ✅ DELETE
    public void deleteParking(Long id){

        if(id == null || id <= 0){
            throw new IllegalArgumentException("Invalid parking ID");
        }

        Parking parking = repository.findById(id)
                .orElseThrow(() -> new ParkingNotFoundException(PARKING_NOT_FOUND));

        repository.delete(parking);
    }
}