package com.parksmart.booking_service.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.io.IOException;
import java.security.Key;
import java.util.Date;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class JwtFilterTest {

    @InjectMocks
    private JwtFilter filter;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    private final String SECRET =
            "parksmartsecretkeyparksmartsecretkeyparksmartsecretkey";

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        // Inject secret manually (since @Value won't work in unit test)
        ReflectionTestUtils.setField(filter, "secret", SECRET);

        // 🔥 Clear previous authentication
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        // 🔥 Clean again after test
        SecurityContextHolder.clearContext();
    }

    // ✅ VALID TOKEN TEST
    @Test
    void testValidToken() throws ServletException, IOException {

        Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

        String token = Jwts.builder()
                .setSubject("anu")
                .claim("role", "USER")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 100000))
                .signWith(key)
                .compact();

        when(request.getHeader("Authorization"))
                .thenReturn("Bearer " + token);

        filter.doFilterInternal(request, response, filterChain);

        assertNotNull(
                SecurityContextHolder.getContext().getAuthentication()
        );

        verify(filterChain).doFilter(request, response);
    }

    // ❌ INVALID TOKEN TEST
    @Test
    void testInvalidToken() throws ServletException, IOException {

        when(request.getHeader("Authorization"))
                .thenReturn("Bearer invalid_token");

        filter.doFilterInternal(request, response, filterChain);

        assertNull(
                SecurityContextHolder.getContext().getAuthentication()
        );

        verify(filterChain).doFilter(request, response);
    }

    // ❌ NO HEADER TEST
    @Test
    void testNoAuthorizationHeader() throws ServletException, IOException {

        when(request.getHeader("Authorization"))
                .thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        assertNull(
                SecurityContextHolder.getContext().getAuthentication()
        );

        verify(filterChain).doFilter(request, response);
    }
}