package com.code2care.demand.infrastructure.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DemandConfig {
    @Bean(name = "demandModelMapper")
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
