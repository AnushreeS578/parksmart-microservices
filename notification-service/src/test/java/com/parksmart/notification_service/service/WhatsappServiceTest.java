package com.parksmart.notification_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;

import org.junit.jupiter.api.Test;

import org.springframework.test.util.ReflectionTestUtils;

public class WhatsappServiceTest {

    private WhatsappService whatsappService;

    @BeforeEach
    void setup() {

        whatsappService =
                new WhatsappService();

        ReflectionTestUtils.setField(
                whatsappService,
                "sid",
                "test_sid"
        );

        ReflectionTestUtils.setField(
                whatsappService,
                "token",
                "test_token"
        );

        ReflectionTestUtils.setField(
                whatsappService,
                "from",
                "+14155238886"
        );
    }

    @Test
    void testEmptyPhoneNumber() {

        RuntimeException ex =

                assertThrows(

                        RuntimeException.class,

                        () -> whatsappService
                                .sendWhatsapp(
                                        "",
                                        "Hello"
                                )
                );

        assertEquals(
                "Phone Number Cannot Be Empty",
                ex.getMessage()
        );
    }

    @Test
    void testNullPhoneNumber() {

        RuntimeException ex =

                assertThrows(

                        RuntimeException.class,

                        () -> whatsappService
                                .sendWhatsapp(
                                        null,
                                        "Hello"
                                )
                );

        assertEquals(
                "Phone Number Cannot Be Empty",
                ex.getMessage()
        );
    }

    @Test
    void testEmptyMessage() {

        RuntimeException ex =

                assertThrows(

                        RuntimeException.class,

                        () -> whatsappService
                                .sendWhatsapp(
                                        "+919999999999",
                                        ""
                                )
                );

        assertEquals(
                "Message Cannot Be Empty",
                ex.getMessage()
        );
    }

    @Test
    void testNullMessage() {

        RuntimeException ex =

                assertThrows(

                        RuntimeException.class,

                        () -> whatsappService
                                .sendWhatsapp(
                                        "+919999999999",
                                        null
                                )
                );

        assertEquals(
                "Message Cannot Be Empty",
                ex.getMessage()
        );
    }

    @Test
    void testWhatsappFailure() {

        String result =
                whatsappService.sendWhatsapp(
                        "+919999999999",
                        "Hello"
                );

        assertEquals(
                "WhatsApp Failed ❌",
                result
        );
    }
}
