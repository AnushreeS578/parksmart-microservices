package com.parksmart.auth_service.config;

import org.aspectj.lang.JoinPoint;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuthAOP {

    private static final Logger log =

            LoggerFactory.getLogger(
                    AuthAOP.class
            );

    @Before(
        "execution(* com.parksmart..service.*.*(..))"
    )
    public void logBefore(
            JoinPoint joinPoint) {

        log.info(
                "Entering: {}",
                joinPoint
                .getSignature()
                .getName()
        );
    }

    @AfterReturning(

        pointcut =
        "execution(* com.parksmart..service.*.*(..))",

        returning = "result"
    )
    public void logAfter(

            JoinPoint joinPoint,

            Object result) {

        log.info(

                "Exiting: {} with result: {}",

                joinPoint
                        .getSignature()
                        .getName(),

                result
        );
    }

    @AfterThrowing(

        pointcut =
        "execution(* com.parksmart..service.*.*(..))",

        throwing = "ex"
    )
    public void logException(

            JoinPoint joinPoint,

            Exception ex) {

        log.error(

                "Exception in {}: {}",

                joinPoint
                        .getSignature()
                        .getName(),

                ex.getMessage()
        );
    }
}