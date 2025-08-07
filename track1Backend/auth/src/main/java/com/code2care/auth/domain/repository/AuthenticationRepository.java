package com.code2care.auth.domain.repository;

import com.code2care.auth.application.dto.AuthenticationRequest;
import com.code2care.auth.application.dto.RegisterRequest;
import com.code2care.common.domain.model.DoctorDto;

import java.util.Optional;

public interface AuthenticationRepository {
    DoctorDto save(DoctorDto doctorDto);
    Optional<DoctorDto> findByEmail(String email);
}
