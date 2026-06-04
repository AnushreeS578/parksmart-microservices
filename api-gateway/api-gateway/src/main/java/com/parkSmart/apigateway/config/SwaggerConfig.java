package com.parkSmart.apigateway.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {

        return new OpenAPI()

                .info(

                    new Info()

                        .title("ParkSmart API Gateway")

                        .version("1.0")

                        .description(
                            "Centralized API Documentation for ParkSmart Microservices"
                        )
                );
    }
}
