package com.parksmart.booking_service.repository;

import com.parksmart.booking_service.entity.Booking;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	boolean existsByParkingIdAndSlotNumberAndStatus(
	        Long parkingId,
	        int slotNumber,
	        String status
	);
	
}
