package com.parksmart.email_service.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.springframework.mail.SimpleMailMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.mail.javamail.JavaMailSender;

import com.parksmart.email_service.dto.EmailRequestDTO;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService service;

    @Test
    void testSendEmail() {

        EmailRequestDTO dto =
                new EmailRequestDTO();

        dto.setTo("test@gmail.com");

        dto.setSubject("Test");

        dto.setMessage("Hello");

        String result =
                service.sendEmail(dto);

        assertEquals(
                "Email Sent Successfully ✅",
                result
        );

        verify(mailSender,
                times(1))
                .send(any(org.springframework.mail.SimpleMailMessage.class));
    }

    @Test
    void testNullEmail() {

        RuntimeException ex =
                assertThrows(

                        RuntimeException.class,

                        () -> service.sendEmail(null)
                );

        assertEquals(
                "Email Request Cannot Be Null",
                ex.getMessage()
        );
    }
}
