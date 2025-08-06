package com.code2care.bloodUnit.infrastructure.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BloodUnitConfig {
    @Bean(name = "bloodUnitModelMapper")
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
