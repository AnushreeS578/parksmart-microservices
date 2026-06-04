package com.parksmart.payment_service.repository;

import com.parksmart.payment_service.entity.Payment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
	boolean existsByBookingId(Long BookingId);
	 List<Payment> findByUserId(Long userId);
	 
}