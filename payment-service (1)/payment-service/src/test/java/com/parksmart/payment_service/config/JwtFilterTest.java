package com.parksmart.payment_service.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import org.springframework.security.core.context.SecurityContextHolder;

import java.security.Key;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtFilterTest {

    private JwtFilter filter;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    private final String SECRET = "mysecretkeymysecretkeymysecretkey123"; // ≥32 chars

    private String validToken;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        filter = new JwtFilter(SECRET);

        Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

        validToken = Jwts.builder()
                .setSubject("anu")
                .claim("role", "USER")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 100000))
                .signWith(key)
                .compact();

        SecurityContextHolder.clearContext();
    }

    // ✅ VALID TOKEN
    @Test
    void testValidToken() throws Exception {

        when(request.getHeader("Authorization"))
                .thenReturn("Bearer " + validToken);

        filter.doFilterInternal(request, response, filterChain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("anu",
                SecurityContextHolder.getContext().getAuthentication().getPrincipal());

        verify(filterChain).doFilter(request, response);
    }

    // ❌ INVALID TOKEN
    @Test
    void testInvalidToken() throws Exception {

        when(request.getHeader("Authorization"))
                .thenReturn("Bearer invalid_token");

        assertThrows(Exception.class, () ->
                filter.doFilterInternal(request, response, filterChain)
        );
    }

    // ❌ NO HEADER
    @Test
    void testNoHeader() throws Exception {

        when(request.getHeader("Authorization"))
                .thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());

        verify(filterChain).doFilter(request, response);
    }
}