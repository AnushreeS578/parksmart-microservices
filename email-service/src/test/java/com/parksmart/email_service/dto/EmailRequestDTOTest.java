package com.parksmart.email_service.dto;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class EmailRequestDTOTest {

    @Test
    void testDTO() {

        EmailRequestDTO dto =
                new EmailRequestDTO();

        dto.setTo("test@gmail.com");

        dto.setSubject("Hello");

        dto.setMessage("Message");

        assertEquals(
                "test@gmail.com",
                dto.getTo()
        );

        assertEquals(
                "Hello",
                dto.getSubject()
        );

        assertEquals(
                "Message",
                dto.getMessage()
        );
    }
}
