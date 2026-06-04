package com.parksmart.auth_service.controller;

import org.springframework.web.bind.annotation.*;

import org.springframework.validation.annotation.Validated;

import com.parksmart.auth_service.dto.ForgotPasswordRequest;
import com.parksmart.auth_service.dto.LoginRequest;
import com.parksmart.auth_service.dto.ResetPasswordRequest;
import com.parksmart.auth_service.dto.UserRequestDTO;
import com.parksmart.auth_service.dto.VerifyOtpRequest;

import com.parksmart.auth_service.entity.User;

import com.parksmart.auth_service.security.JwtUtil;

import com.parksmart.auth_service.service.AuthService;

import java.util.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@Validated
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    private final JwtUtil jwtUtil;

    // CONSTRUCTOR INJECTION
    public AuthController(
            AuthService service,
            JwtUtil jwtUtil) {

        this.service = service;

        this.jwtUtil = jwtUtil;
    }

    // REGISTER
    @PostMapping("/register")
    public String register(

            @Valid
            @RequestBody
            UserRequestDTO request){

        User user = new User();

        user.setUsername(
                request.getUsername()
        );

        user.setPassword(
                request.getPassword()
        );

        user.setRole(
                request.getRole()
        );

        return service.register(user);
    }

    // LOGIN
    @PostMapping("/login")
    public Map<String, Object> login(

            @Valid
            @RequestBody
            LoginRequest request){

        User user =
                service.authenticate(

                        request.getUsername(),

                        request.getPassword()
                );

        String token =
                jwtUtil.generateToken(

                        user.getUsername(),

                        user.getRole()
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "token",
                token
        );

        response.put(
                "role",
                user.getRole()
        );

        response.put(
                "username",
                user.getUsername()
        );

        response.put(
                "userId",
                user.getId()
        );

        return response;
    }

    // VALIDATE USER
    @GetMapping("/validate")
    public String validateUser(

            @RequestParam

            @NotBlank(
                    message =
                    "Username required"
            )

            String username){

        return service.validateUser(
                username
        );
    }

    // SEND OTP
    @PostMapping("/send-otp")
    public String sendOtp(

            @Valid
            @RequestBody
            ForgotPasswordRequest request) {

        return service.sendOtp(
                request.getUsername()
        );
    }

    // VERIFY OTP
    @PostMapping("/verify-otp")
    public String verifyOtp(

            @Valid
            @RequestBody
            VerifyOtpRequest request) {

        return service.verifyOtp(
                request
        );
    }

    // RESET PASSWORD
    @PutMapping("/reset-password")
    public String resetPassword(

            @Valid
            @RequestBody
            ResetPasswordRequest request) {

        return service.resetPassword(
                request
        );
    }
}