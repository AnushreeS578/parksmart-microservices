package com.parksmart.payment_service.dto;

import lombok.Data;

@Data
public class RazorpayOrderResponse {

    private String orderId;
    private double amount;
    private String key;
    private String currency;
}
