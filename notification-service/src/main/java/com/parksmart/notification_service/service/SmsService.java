/*package com.parksmart.notification_service.service;

import com.twilio.Twilio;

import com.twilio.rest.api.v2010.account.Message;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.account.sid}")
    private String sid;

    @Value("${twilio.auth.token}")
    private String token;

    @Value("${twilio.sms.number}")
    private String from;

    public String sendSms(
            String to,
            String msg) {

        try {

            Twilio.init(sid, token);

            System.out.println(
                    "SMS TO = " + to
            );

            System.out.println(
                    "SMS FROM = " + from
            );

            Message message =
                    Message.creator(

                            new com.twilio.type.PhoneNumber(to),

                            new com.twilio.type.PhoneNumber(from),

                            msg

                    ).create();

            System.out.println(
                    "SMS SID = "
                            + message.getSid()
            );

            System.out.println(
                    "SMS STATUS = "
                            + message.getStatus()
            );

            return "SMS Sent ✅";

        } catch (Exception e) {

            System.out.println(
                    "SMS ERROR = "
                            + e.getMessage()
            );

            e.printStackTrace();

            return "SMS Failed ❌";
        }
    }
}*/