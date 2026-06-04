package com.parksmart.auth_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "user") 
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;
    
    @Column(unique = true)
    private String email;

    // Default constructor (required by JPA)
    public User() {
        // intentionally empty
    }

    // Parameterized constructor (optional but good)
    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    

   
}