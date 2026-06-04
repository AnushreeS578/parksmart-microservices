package com.parkSmart.apigateway;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiGatewayApplication {
	
	//starts the api gateway server
	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

}
