package com.parksmart.email_service.service;

import com.parksmart.email_service.dto.EmailRequestDTO;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(
            JavaMailSender mailSender) {

        this.mailSender = mailSender;
    }

    public String sendEmail(
            EmailRequestDTO dto) {

        if (dto == null) {

            throw new RuntimeException(
                    "Email Request Cannot Be Null"
            );
        }

        try {

            SimpleMailMessage mail =
                    new SimpleMailMessage();

            mail.setTo(dto.getTo());

            mail.setSubject(
                    dto.getSubject()
            );

            mail.setText(
                    dto.getMessage()
            );

            mailSender.send(mail);

            return "Email Sent Successfully ✅";

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed To Send Email ❌"
            );
        }
    }
}