package com.parksmart.booking_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private static final String ROLE_ADMIN = "ADMIN";
    private static final String ROLE_USER = "USER";

    private static final String BOOKING = "/booking";
    private static final String BOOKING_ALL = "/booking/**";

    @Bean
    public JwtFilter jwtFilter() {
        return new JwtFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // =====================================
                // SWAGGER APIs
                // =====================================

                .requestMatchers(
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                ).permitAll()

                // =========================
                // CREATE BOOKING
                // =========================

                .requestMatchers(
                        HttpMethod.POST,
                        BOOKING
                ).hasAnyRole(
                        ROLE_USER,
                        ROLE_ADMIN
                )

                // =========================
                // GET ALL BOOKINGS
                // =========================

                .requestMatchers(
                        HttpMethod.GET,
                        BOOKING
                ).hasAnyRole(
                        ROLE_USER,
                        ROLE_ADMIN
                )

                // =========================
                // GET BOOKING BY ID
                // =========================

                .requestMatchers(
                        HttpMethod.GET,
                        BOOKING_ALL
                ).permitAll()

                // =========================
                // CANCEL BOOKING
                // =========================

                .requestMatchers(
                        HttpMethod.DELETE,
                        BOOKING_ALL
                ).hasAnyRole(
                        ROLE_USER,
                        ROLE_ADMIN
                )

                // =========================
                // OTHER APIs
                // =========================

                .anyRequest().authenticated()
            )

            .addFilterBefore(
                    jwtFilter(),
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}