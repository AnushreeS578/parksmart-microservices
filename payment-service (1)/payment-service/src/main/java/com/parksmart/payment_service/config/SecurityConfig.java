package com.parksmart.payment_service.config;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    
    private static final String ADMIN = "ADMIN";

    private static final String USER = "USER";

    
    @Value("${jwt.secret}")
    private String secret;

    
    @Bean
    public JwtFilter jwtFilter() {

        return new JwtFilter(secret);
    }

    

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http
    ) throws Exception {

        http

            // DISABLE CSRF
            .csrf(csrf -> csrf.disable())

            
            .authorizeHttpRequests(auth -> auth

                
                .requestMatchers(
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                ).permitAll()

                
                .requestMatchers(
                        HttpMethod.POST,
                        "/payment"
                ).hasRole(USER)

                
                .requestMatchers(
                        HttpMethod.GET,
                        "/payment"
                ).hasRole(ADMIN)

                
                // GET USER PAYMENTS

                .requestMatchers(
                        HttpMethod.GET,
                        "/payment/user/**"
                ).hasAnyRole(
                        USER,
                        ADMIN
                )

                // CREATE RAZORPAY ORDER

                .requestMatchers(
                        HttpMethod.POST,
                        "/payment/create-order/**"
                ).hasAnyRole(
                        USER,
                        ADMIN
                )

                // VERIFY PAYMENT

                .requestMatchers(
                        HttpMethod.POST,
                        "/payment/verify"
                ).hasAnyRole(
                        USER,
                        ADMIN
                )

                

                .requestMatchers(
                        "/actuator/**"
                ).permitAll()

                
                .anyRequest().authenticated()
            )

            
            .addFilterBefore(
                    jwtFilter(),
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}