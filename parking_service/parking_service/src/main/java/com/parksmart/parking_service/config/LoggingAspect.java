package com.parksmart.parking_service.config;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    @Before("execution(* com.parksmart..service.*.*(..))")
    public void before(JoinPoint jp) {
        log.info("Entering: {}", jp.getSignature().getName());
    }

    @AfterReturning(pointcut = "execution(* com.parksmart..service.*.*(..))", returning = "res")
    public void after(JoinPoint jp, Object res) {
        log.info("Exiting: {} with {}", jp.getSignature().getName(), res);
    }

    @AfterThrowing(pointcut = "execution(* com.parksmart..service.*.*(..))", throwing = "ex")
    public void exception(JoinPoint jp, Exception ex) {
        log.error("Error in {}: {}", jp.getSignature().getName(), ex.getMessage());
    }
}
