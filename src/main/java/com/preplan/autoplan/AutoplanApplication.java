package com.preplan.autoplan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class AutoplanApplication {

    public static void main(String[] args) {
        SpringApplication.run(AutoplanApplication.class, args);
    }

}
