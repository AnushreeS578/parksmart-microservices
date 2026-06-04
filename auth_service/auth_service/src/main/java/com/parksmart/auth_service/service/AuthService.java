package com.parksmart.auth_service.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.parksmart.auth_service.client.EmailClient;
import com.parksmart.auth_service.dto.EmailRequestDTO;
import com.parksmart.auth_service.dto.ResetPasswordRequest;
import com.parksmart.auth_service.dto.VerifyOtpRequest;

import com.parksmart.auth_service.entity.PasswordResetOtp;
import com.parksmart.auth_service.entity.User;

import com.parksmart.auth_service.exception.InvalidCredentialsException;
import com.parksmart.auth_service.exception.UserNotFoundException;
import com.parksmart.auth_service.exception.OtpException;

import com.parksmart.auth_service.repository.PasswordResetOtpRepository;
import com.parksmart.auth_service.repository.UserRepository;

import com.parksmart.auth_service.security.JwtUtil;

import jakarta.transaction.Transactional;

@Service
public class AuthService {

    private final UserRepository repository;

    private final JwtUtil jwtUtil;

    private final PasswordEncoder passwordEncoder;

    private final PasswordResetOtpRepository otpRepository;

    private final EmailClient emailClient;

    public AuthService(

            UserRepository repository,

            JwtUtil jwtUtil,

            PasswordEncoder passwordEncoder,

            PasswordResetOtpRepository otpRepository,

            EmailClient emailClient) {

        this.repository = repository;

        this.jwtUtil = jwtUtil;

        this.passwordEncoder = passwordEncoder;

        this.otpRepository = otpRepository;

        this.emailClient = emailClient;
    }

    // REGISTER
    public String register(User user) {

        if (user.getUsername() == null
                || user.getPassword() == null) {

            throw new IllegalArgumentException(
                    "Username and Password required"
            );
        }

        if (repository.existsByUsername(
                user.getUsername())) {

            throw new IllegalArgumentException(
                    "Username already taken"
            );
        }

        if (user.getRole() == null
                || user.getRole().isEmpty()) {

            user.setRole("USER");
        }

        // ENCRYPT PASSWORD
        user.setPassword(

                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        repository.save(user);

        return "User Registered Successfully";
    }

    // LOGIN
    public String login(
            String username,
            String password) {

        User user =
                authenticate(
                        username,
                        password
                );

        return jwtUtil.generateToken(
                user.getUsername(),
                user.getRole()
        );
    }

    // VALIDATE USER
    public String validateUser(
            String username) {

        repository.findByUsername(
                username
        ).orElseThrow(() ->

                new UserNotFoundException(
                        "User not registered"
                )
        );

        return "Valid user";
    }

    // AUTHENTICATE
    public User authenticate(
            String username,
            String password) {

        User user =
                repository.findByUsername(
                        username
                ).orElseThrow(() ->

                        new UserNotFoundException(
                                "Invalid username"
                        )
                );

        // CHECK HASHED PASSWORD
        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new InvalidCredentialsException(
                    "Invalid password"
            );
        }

        return user;
    }

    // SEND OTP
    @Transactional
    public String sendOtp(
            String username) {

        User user =
                repository.findByUsername(
                        username
                ).orElseThrow(() ->

                        new UserNotFoundException(
                                "User not found"
                        )
                );

        // CHECK EMAIL
        if (user.getEmail() == null
                || user.getEmail().isEmpty()) {

            throw new OtpException(
                    "Email not found in profile"
            );
        }

        // GENERATE OTP
        String otp =
                String.valueOf(

                        100000 +
                        new java.security.SecureRandom()
                                .nextInt(900000)
                );

        // DELETE OLD OTP
        otpRepository.deleteByUsername(
                username
        );

        // SAVE OTP
        PasswordResetOtp resetOtp =
                new PasswordResetOtp();

        resetOtp.setUsername(
                username
        );

        resetOtp.setOtp(
                otp
        );

        resetOtp.setExpiryTime(

                LocalDateTime.now()
                        .plusMinutes(5)
        );

        otpRepository.save(resetOtp);

        // SEND EMAIL
        EmailRequestDTO email =
                new EmailRequestDTO();

        email.setTo(
                user.getEmail()
        );

        email.setSubject(
                "ParkSmart Password Reset OTP"
        );

        email.setMessage(

                "Your OTP is: "
                        + otp +

                        "\n\nValid for 5 minutes."
        );

        emailClient.sendEmail(email);

        return "OTP sent successfully ✅";
    }

    // VERIFY OTP
    public String verifyOtp(
            VerifyOtpRequest request) {

        PasswordResetOtp otpData =

                otpRepository
                        .findByUsername(
                                request.getUsername()
                        )

                        .orElseThrow(() ->

                                new OtpException(
                                        "OTP not found"
                                )
                        );

        // EXPIRED
        if (otpData.getExpiryTime()
                .isBefore(
                        LocalDateTime.now()
                )) {

            throw new OtpException(
                    "OTP expired"
            );
        }

        // INVALID OTP
        if (!otpData.getOtp()
                .equals(
                        request.getOtp()
                )) {

            throw new OtpException(
                    "Invalid OTP"
            );
        }

        return "OTP verified successfully ✅";
    }

    // RESET PASSWORD
    @Transactional
    public String resetPassword(
            ResetPasswordRequest request) {

        // VERIFY OTP
        VerifyOtpRequest verify =
                new VerifyOtpRequest();

        verify.setUsername(
                request.getUsername()
        );

        verify.setOtp(
                request.getOtp()
        );

        verifyOtp(verify);

        User user =
                repository.findByUsername(
                        request.getUsername()
                ).orElseThrow(() ->

                        new UserNotFoundException(
                                "User not found"
                        )
                );

        // ENCODE PASSWORD
        user.setPassword(

                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        repository.save(user);

        // DELETE OTP
        otpRepository.deleteByUsername(
                request.getUsername()
        );

        return "Password reset successful ✅";
    }
}