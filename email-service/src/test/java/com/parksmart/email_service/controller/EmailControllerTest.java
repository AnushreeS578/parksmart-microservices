package com.parksmart.email_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.parksmart.email_service.dto.EmailRequestDTO;
import com.parksmart.email_service.service.EmailService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmailController.class)
@AutoConfigureMockMvc(addFilters = false)
class EmailControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmailService service;

    @Autowired
    private ObjectMapper mapper;

    @Test
    void testSendEmail() throws Exception {

        EmailRequestDTO dto =
                new EmailRequestDTO();

        dto.setTo("test@gmail.com");
        dto.setSubject("Test");
        dto.setMessage("Hello");

        when(service.sendEmail(any()))
                .thenReturn(
                        "Email Sent Successfully ✅"
                );

        mockMvc.perform(

                post("/email/send")

                .contentType(
                        MediaType.APPLICATION_JSON
                )

                .content(
                        mapper.writeValueAsString(dto)
                )

        )
        .andExpect(status().isOk());
    }
}