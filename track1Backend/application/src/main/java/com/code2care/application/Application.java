package com.code2care.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
		"com.code2care.auth",
		"com.code2care.feedBack",
		"com.code2care.reminder",
		"com.code2care.analytics",
		"com.code2care.common",
		"com.code2care.notification"
})
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
