package com.preplan.autoplan.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Bean;
//import org.springframework.boot.actuator.trace.http.HttpTraceRepository;
//import org.springframework.boot.actuator.trace.http.InMemoryHttpTraceRepository;

@Configuration
@EnableAspectJAutoProxy
public class PerformanceMonitoringConfig {

//    @Bean
//    public HttpTraceRepository httpTraceRepository() {
//        return new InMemoryHttpTraceRepository();
//    }
}
