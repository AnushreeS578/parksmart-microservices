package com.parksmart.user_service.repository;



import com.parksmart.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
	boolean existsByEmail(String email);
	User findByUsername(String username);
}