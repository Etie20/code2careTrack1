package com.code2care.application.infrastructure.config;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

@Slf4j
public class DotEnvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();

        try {
            Dotenv dotenv;

            // Essayer de charger depuis le répertoire racine
            try {
                dotenv = Dotenv.configure()
                        .directory(".") // Répertoire racine du projet
                        .filename(".env")
                        .ignoreIfMalformed()
                        .load();
                log.info("Loaded .env file from root directory");
            } catch (Exception e) {
                log.debug("Could not load .env from root directory, trying from classpath", e);

                // Alternative : charger depuis le classpath
                try {
                    dotenv = Dotenv.configure()
                            .directory("./")
                            .filename(".env")
                            .ignoreIfMalformed()
                            .ignoreIfMissing()
                            .load();
                    log.info("Loaded .env file from classpath");
                } catch (Exception ex) {
                    log.warn("No .env file found in root or classpath");
                    return;
                }
            }

            if (dotenv != null) {
                Map<String, Object> dotenvProperties = new HashMap<>();

                // Ajouter toutes les variables du fichier .env aux propriétés Spring
                dotenv.entries().forEach(entry -> {
                    String key = entry.getKey();
                    String value = entry.getValue();
                    dotenvProperties.put(key, value);

                    // Définir aussi comme propriété système pour compatibilité
                    System.setProperty(key, value);

                    log.debug("Loaded .env property: {} = {}", key, maskSensitiveValue(key, value));
                });

                // Ajouter les propriétés à l'environnement Spring avec une priorité élevée
                environment.getPropertySources().addFirst(
                        new MapPropertySource("dotenv", dotenvProperties)
                );

                log.info("Successfully loaded {} properties from .env file", dotenvProperties.size());
            }

        } catch (DotenvException e) {
            log.warn("Could not load .env file: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Error loading .env file", e);
        }
    }

    private String maskSensitiveValue(String key, String value) {
        // Masquer les valeurs sensibles dans les logs
        String lowerKey = key.toLowerCase();
        if (lowerKey.contains("password") || lowerKey.contains("secret") ||
                lowerKey.contains("key") || lowerKey.contains("token") ||
                lowerKey.contains("auth") || lowerKey.contains("api")) {
            if (value != null && value.length() > 4) {
                return value.substring(0, 4) + "***MASKED***";
            }
            return "***MASKED***";
        }
        return value;
    }
}