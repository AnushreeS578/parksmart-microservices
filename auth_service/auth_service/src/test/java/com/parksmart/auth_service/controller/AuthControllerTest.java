package com.parksmart.auth_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.parksmart.auth_service.dto.LoginRequest;
import com.parksmart.auth_service.dto.UserRequestDTO;
import com.parksmart.auth_service.entity.User;
import com.parksmart.auth_service.security.JwtUtil;
import com.parksmart.auth_service.service.AuthService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // 🔥 disable security
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService service;

    @MockBean
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    // ✅ REGISTER TEST
    @Test
    void testRegister() throws Exception {

        UserRequestDTO dto = new UserRequestDTO();
        dto.setUsername("anu");
        dto.setPassword("123");
        dto.setRole("USER");

        when(service.register(any())).thenReturn("User Registered Successfully");

        mockMvc.perform(post("/auth/register")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("User Registered Successfully"));
    }

    // ✅ LOGIN TEST
    @Test
    void testLogin() throws Exception {

        LoginRequest request = new LoginRequest();
        request.setUsername("anu");
        request.setPassword("123");

        User user = new User();
        user.setUsername("anu");
        user.setRole("USER");

        when(service.authenticate("anu","123")).thenReturn(user);
        when(jwtUtil.generateToken(any(), any())).thenReturn("token123");

        mockMvc.perform(post("/auth/login")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token123"));
    }

    // ✅ VALIDATE USER
    @Test
    void testValidateUser() throws Exception {

        when(service.validateUser("anu")).thenReturn("Valid user");

        mockMvc.perform(get("/auth/validate")
                .param("username", "anu"))
                .andExpect(status().isOk())
                .andExpect(content().string("Valid user"));
    }
}