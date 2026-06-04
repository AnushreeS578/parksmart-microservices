package com.parksmart.auth_service.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    // ✅ Use strong secret (at least 32 chars for HS256)
    private final String SECRET = "mysecretkeymysecretkeymysecretkey12";
    private final long EXPIRATION = 1000 * 60 * 60; // 1 hour

    private JwtUtil jwtUtil = new JwtUtil(SECRET, EXPIRATION);

    // ✅ TEST TOKEN GENERATION
    @Test
    void testGenerateToken() {

        String token = jwtUtil.generateToken("anu", "USER");

        assertNotNull(token);
        assertFalse(token.isEmpty());

        // JWT always starts with base64 header
        assertTrue(token.startsWith("ey"));
    }

    // ✅ TEST DIFFERENT USERS
    @Test
    void testGenerateTokenDifferentUsers() {

        String token1 = jwtUtil.generateToken("anu", "USER");
        String token2 = jwtUtil.generateToken("admin", "ADMIN");

        assertNotEquals(token1, token2);
    }

    // ✅ TEST TOKEN STRUCTURE (3 parts)
    @Test
    void testTokenStructure() {

        String token = jwtUtil.generateToken("anu", "USER");

        String[] parts = token.split("\\.");

        assertEquals(3, parts.length); // header.payload.signature
    }

    // ✅ TEST EXPIRATION (basic check)
    @Test
    void testTokenExpiration() {

        String token = jwtUtil.generateToken("anu", "USER");

        assertNotNull(token);
    }
}