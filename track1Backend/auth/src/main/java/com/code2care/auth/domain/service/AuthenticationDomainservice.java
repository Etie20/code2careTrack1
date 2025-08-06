package com.code2care.auth.domain.service;

import com.code2care.auth.application.dto.RegisterRequest;
import com.code2care.auth.domain.repository.AuthenticationRepository;
import com.code2care.common.domain.model.DoctorDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationDomainservice {
    private final AuthenticationRepository authenticationRepository;

    public DoctorDto save(DoctorDto doctorDto) {
        return authenticationRepository.save(doctorDto);
    }

    public Optional<DoctorDto> findByEmail(String email) {
        return authenticationRepository.findByEmail(email);
    }


}
