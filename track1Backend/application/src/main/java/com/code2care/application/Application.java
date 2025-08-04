package com.code2care.application;

import com.code2care.application.infrastructure.config.DotEnvConfig;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication(scanBasePackages = {
		"com.code2care.auth",
		"com.code2care.feedback",
		"com.code2care.reminder",
		"com.code2care.analytics",
		"com.code2care.common",
		"com.code2care.notification",
		"com.code2care.donor"
})
@EnableScheduling
public class Application {
	static {
		try {
			Path path = Paths.get(new ClassPathResource(".env").getURI());

			System.out.println(path.toAbsolutePath());

			Resource resource = new ClassPathResource(".env");

			System.out.println(resource.getFile().getAbsolutePath());
			Dotenv dotenv = Dotenv.configure()
					.directory(resource.getDescription())
//					.directory("C:\\Users\\danie\\IdeaProjects\\code2careTrack1\\track1Backend\\application\\.env")
					.ignoreIfMissing()
					.load();

			dotenv.entries().forEach(entry ->{
					System.out.println(entry.getKey() + ": " + entry.getValue());
					System.setProperty(entry.getKey(), entry.getValue());
					}

			);

			System.out.println("Loaded " + dotenv.entries().size() + " environment variables");
		}
		catch (Exception e) {
			System.err.println("Failed to load .env file: " + e.getMessage());
		}
	}


	public static void main(String[] args) {

		SpringApplication app = new SpringApplication(Application.class);
		app.addInitializers(new DotEnvConfig());
		app.run(args);

	}

}
