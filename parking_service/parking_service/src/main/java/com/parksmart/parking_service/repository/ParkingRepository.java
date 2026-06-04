package com.parksmart.parking_service.repository;

import com.parksmart.parking_service.entity.Parking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingRepository extends JpaRepository<Parking, Long> {
	boolean existsByLocation(String location);
}