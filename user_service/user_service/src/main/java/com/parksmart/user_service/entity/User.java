package com.parksmart.user_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Password required")
    private String password;

    @NotBlank(message = "Username required")
    private String username;

    @NotBlank(message = "Name required")
    private String name;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email required")
    private String email;

    @NotBlank(message = "Phone required")
    private String phone;

    // ✅ ADD THIS (IMPORTANT 🔥)
    @NotBlank(message = "Role required")
    private String role;

}