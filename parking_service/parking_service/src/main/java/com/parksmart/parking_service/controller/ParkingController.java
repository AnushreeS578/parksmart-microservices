package com.parksmart.parking_service.controller;

import com.parksmart.parking_service.dto.ParkingRequestDTO;
import com.parksmart.parking_service.entity.Parking;
import com.parksmart.parking_service.service.ParkingService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/parking")
public class ParkingController {

    private final ParkingService service;

    // Constructor Injection
    public ParkingController(ParkingService service) {
        this.service = service;
    }

    // CONSTANT (Sonar fix)
    private static final String DELETE_MSG = "Parking deleted successfully";

    // ADMIN add parking
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Parking addParking(@Valid @RequestBody ParkingRequestDTO dto){

        Parking parking = new Parking();
        parking.setLocation(dto.getLocation());
        parking.setTotalSlots(dto.getTotalSlots());
        parking.setAvailableSlots(dto.getAvailableSlots());
        parking.setPricePerHour(dto.getPricePerHour()); // 🔥 IMPORTANT FIX

        return service.addParking(parking);
    }

    // GET ALL
    @GetMapping
    public List<Parking> getParking(){
        return service.getParking();
    }
    
    // GET BY ID
    @GetMapping("/{id}")
    public Parking getParkingById(@PathVariable Long id){
        return service.getParkingById(id);
    }
    
    // ADMIN update parking
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Parking updateParking(
            @PathVariable Long id,
            @Valid @RequestBody ParkingRequestDTO dto){
        Parking parking = new Parking();
        parking.setLocation(dto.getLocation());
        parking.setTotalSlots(dto.getTotalSlots());
        parking.setAvailableSlots(dto.getAvailableSlots());

        return service.updateParking(id, parking);
    }
    
    // REDUCE SLOT
    @PutMapping("/reduce/{id}")
    public void reduceSlot(@PathVariable Long id){
        service.reduceSlot(id);
    }

    // INCREASE SLOT
    @PutMapping("/increase/{id}")
    public void increaseSlot(@PathVariable Long id){
        service.increaseSlot(id);
    }

    // ADMIN delete parking
    @PreAuthorize("hasRole('ADMIN')")  // ✅ FIXED
    @DeleteMapping("/{id}")
    public String deleteParking(@PathVariable Long id){
        service.deleteParking(id);
        return DELETE_MSG;
    }
}