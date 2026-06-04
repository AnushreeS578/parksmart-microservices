package com.parksmart.parking_service.config;

import jakarta.servlet.FilterChain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import org.springframework.security.core.context.SecurityContextHolder;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtFilterTest {

    private JwtFilter jwtFilter;

    private final String SECRET = "parksmartsecretkeyparksmartsecretkeyparksmartsecretkey";

    @BeforeEach
    void setup() {
        jwtFilter = new JwtFilter();

        // manually inject secret (since @Value won't work in unit test)
        try {
            var field = JwtFilter.class.getDeclaredField("secret");
            field.setAccessible(true);
            field.set(jwtFilter, SECRET);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        SecurityContextHolder.clearContext();
    }

    // ✅ VALID TOKEN TEST
    @Test
    void testValidToken() throws Exception {

        Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

        String token = Jwts.builder()
                .setSubject("anu")
                .claim("role", "USER")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 100000))
                .signWith(key)
                .compact();

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + token);

        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        jwtFilter.doFilterInternal(request, response, chain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("anu",
                SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }

    // ❌ INVALID TOKEN TEST
    @Test
    void testInvalidToken() throws Exception {

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer invalidtoken");

        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        jwtFilter.doFilterInternal(request, response, chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    // ❌ NO HEADER TEST
    @Test
    void testNoAuthorizationHeader() throws Exception {

        MockHttpServletRequest request = new MockHttpServletRequest();

        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        jwtFilter.doFilterInternal(request, response, chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}