package com.parksmart.notification_service.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WhatsappService {

    @Value("${twilio.account.sid}")
    private String sid;

    @Value("${twilio.auth.token}")
    private String token;

    @Value("${twilio.whatsapp.number}")
    private String from;

    public String sendWhatsapp(
            String to,
            String msg) {

        if (to == null || to.isBlank()) {

            throw new RuntimeException(
                    "Phone Number Cannot Be Empty"
            );
        }

        if (msg == null || msg.isBlank()) {

            throw new RuntimeException(
                    "Message Cannot Be Empty"
            );
        }

        try {

            Twilio.init(sid, token);

            Message message =
                    Message.creator(

                            new PhoneNumber(
                                    "whatsapp:" + to
                            ),

                            new PhoneNumber(
                                    "whatsapp:" + from
                            ),

                            msg

                    ).create();

            return "WhatsApp Sent ✅";

        } catch (Exception e) {

            e.printStackTrace();

            return "WhatsApp Failed ❌";
        }
    }
}