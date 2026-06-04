package com.parksmart.payment_service.config;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    // BEFORE METHOD EXECUTION
    @Before("execution(* com.parksmart..service.*.*(..))")
    public void before(JoinPoint jp){
        log.info("Entering: {}", jp.getSignature().toShortString());
    }

    // 🔥 AFTER SUCCESS
    @AfterReturning(
        pointcut = "execution(* com.parksmart..service.*.*(..))",
        returning = "res"
    )
    public void after(JoinPoint jp, Object res){
        log.info("Ex iting: {}", jp.getSignature().toShortString());
    }

    // 🔥 AFTER ERROR
    @AfterThrowing(
        pointcut = "execution(* com.parksmart..service.*.*(..))",
        throwing = "ex"
    )
    public void error(JoinPoint jp, Exception ex){
        log.error("Error in {} : {}", jp.getSignature().toShortString(), ex.getMessage());
    }
}