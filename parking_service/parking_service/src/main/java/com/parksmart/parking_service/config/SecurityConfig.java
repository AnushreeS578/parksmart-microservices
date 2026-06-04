package com.parksmart.parking_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    // CONSTANTS
    private static final String ROLE_ADMIN = "ADMIN";
    private static final String ROLE_USER = "USER";

    private static final String PARKING = "/parking";
    private static final String PARKING_ALL = "/parking/**";

    // JWT FILTER
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

                // =====================================
                // ADMIN APIs
                // =====================================

                // ADD PARKING
                .requestMatchers(
                        HttpMethod.POST,
                        PARKING
                ).hasRole(ROLE_ADMIN)

                // UPDATE PARKING
                .requestMatchers(
                        HttpMethod.PUT,
                        "/parking/*"
                ).hasRole(ROLE_ADMIN)

                // DELETE PARKING
                .requestMatchers(
                        HttpMethod.DELETE,
                        PARKING_ALL
                ).hasRole(ROLE_ADMIN)

                // =====================================
                // INTERNAL MICROSERVICE APIs
                // =====================================

                // REDUCE SLOT
                .requestMatchers(
                        HttpMethod.PUT,
                        "/parking/reduce/**"
                ).permitAll()

                // INCREASE SLOT
                .requestMatchers(
                        HttpMethod.PUT,
                        "/parking/increase/**"
                ).permitAll()

                // =====================================
                // USER + ADMIN
                // =====================================

                // GET ALL PARKING
                .requestMatchers(
                        HttpMethod.GET,
                        PARKING
                ).hasAnyRole(
                        ROLE_USER,
                        ROLE_ADMIN
                )

                // GET BY ID
                .requestMatchers(
                        HttpMethod.GET,
                        PARKING_ALL
                ).permitAll()

                // =====================================
                // OTHER APIs
                // =====================================

                .anyRequest().authenticated()
            )

            .addFilterBefore(
                    jwtFilter(),
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}