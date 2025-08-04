package com.code2care.donor.infrastructure.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DonorConfig {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
