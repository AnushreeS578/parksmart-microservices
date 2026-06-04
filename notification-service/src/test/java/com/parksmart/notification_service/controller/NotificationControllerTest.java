package com.parksmart.notification_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.parksmart.notification_service.dto.NotificationRequestDTO;
import com.parksmart.notification_service.entity.Notification;
import com.parksmart.notification_service.repository.NotificationRepository;
import com.parksmart.notification_service.service.NotificationService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@WebMvcTest(NotificationController.class)

@AutoConfigureMockMvc(addFilters = false)

public class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService service;

    @MockBean
    private NotificationRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    private Notification notification;

    @BeforeEach
    void setup() {

        notification = new Notification();

        notification.setId(1L);

        notification.setUserId(3L);

        notification.setMessage(
                "Payment completed"
        );

        notification.setStatus(
                "UNREAD"
        );
    }

    // =========================================
    // TEST GET USER NOTIFICATIONS
    // =========================================

    @Test
    void testGetUserNotifications()
            throws Exception {

        Mockito.when(
                repository.findByUserId(3L)
        ).thenReturn(
                Arrays.asList(notification)
        );

        mockMvc.perform(

                get("/notify/user/3")
        )

        .andDo(print())

        .andExpect(status().isOk())

        .andExpect(
                jsonPath("$[0].userId")
                .value(3)
        )

        .andExpect(
                jsonPath("$[0].message")
                .value("Payment completed")
        );
    }

    // =========================================
    // TEST MARK AS READ
    // =========================================

    @Test
    void testMarkAsRead()
            throws Exception {

        Mockito.when(
                repository.findById(1L)
        ).thenReturn(
                Optional.of(notification)
        );

        mockMvc.perform(

                put("/notify/read/1")
        )

        .andDo(print())

        .andExpect(status().isOk())

        .andExpect(
                content()
                .string("Notification Read ✅")
        );
    }

    // =========================================
    // TEST SEND NOTIFICATION
    // =========================================

    @Test
    void testSendNotification()
            throws Exception {

        NotificationRequestDTO dto =
                new NotificationRequestDTO();

        dto.setTo(
                "test@gmail.com"
        );

        dto.setSubject(
                "Booking Success"
        );

        dto.setMessage(
                "Parking booked successfully"
        );

        dto.setType(
                "EMAIL"
        );

        Mockito.when(
                service.sendNotification(any())
        ).thenReturn(
                "Notification Sent ✅"
        );

        mockMvc.perform(

                post("/notify")

                .contentType(
                        MediaType.APPLICATION_JSON
                )

                .content(
                        objectMapper
                        .writeValueAsString(dto)
                )
        )

        .andDo(print())

        .andExpect(status().isOk())

        .andExpect(
                content()
                .string("Notification Sent ✅")
        );
    }
}