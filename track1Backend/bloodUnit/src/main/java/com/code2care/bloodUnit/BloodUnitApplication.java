package com.code2care.bloodUnit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        scanBasePackages = {
                "com.code2care.analytics"
        }
)
public class BloodUnitApplication {

    public static void main(String[] args) {
        SpringApplication.run(BloodUnitApplication.class, args);
    }

}
