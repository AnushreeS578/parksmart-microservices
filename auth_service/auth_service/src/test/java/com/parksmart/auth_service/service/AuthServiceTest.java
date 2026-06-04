package com.parksmart.auth_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

import java.util.Optional;

import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.parksmart.auth_service.entity.User;
import com.parksmart.auth_service.exception.InvalidCredentialsException;
import com.parksmart.auth_service.exception.UserNotFoundException;
import com.parksmart.auth_service.repository.UserRepository;
import com.parksmart.auth_service.security.JwtUtil;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository repository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    // =========================
    // REGISTER SUCCESS
    // =========================

    @Test
    void testRegisterSuccess() {

        User user = new User();

        user.setUsername("anu");

        user.setPassword("123");

        user.setRole("USER");

        when(repository.existsByUsername("anu"))
                .thenReturn(false);

        when(passwordEncoder.encode("123"))
                .thenReturn("encoded123");

        String result =
                authService.register(user);

        assertEquals(
                "User Registered Successfully",
                result
        );

        verify(repository).save(user);
    }

    // =========================
    // REGISTER USERNAME EXISTS
    // =========================

    @Test
    void testRegisterUsernameExists() {

        User user = new User();

        user.setUsername("anu");

        user.setPassword("123");

        when(repository.existsByUsername("anu"))
                .thenReturn(true);

        RuntimeException ex =
                assertThrows(

                        RuntimeException.class,

                        () -> authService.register(user)
                );

        assertEquals(
                "Username already taken",
                ex.getMessage()
        );
    }

    // =========================
    // REGISTER NULL USERNAME
    // =========================

    @Test
    void testRegisterNullUsername() {

        User user = new User();

        user.setPassword("123");

        RuntimeException ex =
                assertThrows(

                        RuntimeException.class,

                        () -> authService.register(user)
                );

        assertEquals(
                "Username and Password required",
                ex.getMessage()
        );
    }

    // =========================
    // LOGIN SUCCESS
    // =========================

    @Test
    void testLoginSuccess() {

        User user = new User();

        user.setUsername("anu");

        user.setPassword("encoded123");

        user.setRole("ADMIN");

        when(repository.findByUsername("anu"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "123",
                "encoded123"
        )).thenReturn(true);

        when(jwtUtil.generateToken(
                "anu",
                "ADMIN"
        )).thenReturn("jwt-token");

        String token =
                authService.login(
                        "anu",
                        "123"
                );

        assertEquals(
                "jwt-token",
                token
        );
    }

    // =========================
    // LOGIN INVALID USERNAME
    // =========================

    @Test
    void testLoginInvalidUsername() {

        when(repository.findByUsername("anu"))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(

                        UserNotFoundException.class,

                        () -> authService.login(
                                "anu",
                                "123"
                        )
                );

        assertEquals(
                "Invalid username",
                ex.getMessage()
        );
    }

    // =========================
    // LOGIN INVALID PASSWORD
    // =========================

    @Test
    void testLoginInvalidPassword() {

        User user = new User();

        user.setUsername("anu");

        user.setPassword("encoded123");

        when(repository.findByUsername("anu"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "123",
                "encoded123"
        )).thenReturn(false);

        RuntimeException ex =
                assertThrows(

                        InvalidCredentialsException.class,

                        () -> authService.login(
                                "anu",
                                "123"
                        )
                );

        assertEquals(
                "Invalid password",
                ex.getMessage()
        );
    }

    // =========================
    // VALIDATE USER SUCCESS
    // =========================

    @Test
    void testValidateUserSuccess() {

        User user = new User();

        user.setUsername("anu");

        when(repository.findByUsername("anu"))
                .thenReturn(Optional.of(user));

        String result =
                authService.validateUser("anu");

        assertEquals(
                "Valid user",
                result
        );
    }

    // =========================
    // VALIDATE USER FAIL
    // =========================

    @Test
    void testValidateUserFail() {

        when(repository.findByUsername("anu"))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(

                        UserNotFoundException.class,

                        () -> authService.validateUser("anu")
                );

        assertEquals(
                "User not registered",
                ex.getMessage()
        );
    }

    // =========================
    // AUTHENTICATE SUCCESS
    // =========================

    @Test
    void testAuthenticateSuccess() {

        User user = new User();

        user.setUsername("anu");

        user.setPassword("encoded123");

        when(repository.findByUsername("anu"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "123",
                "encoded123"
        )).thenReturn(true);

        User result =
                authService.authenticate(
                        "anu",
                        "123"
                );

        assertEquals(
                "anu",
                result.getUsername()
        );
    }
}