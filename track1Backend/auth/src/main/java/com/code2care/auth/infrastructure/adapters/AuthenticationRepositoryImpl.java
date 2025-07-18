package com.code2care.auth.infrastructure.adapters;

import com.code2care.auth.domain.repository.AuthenticationRepository;
import com.code2care.auth.infrastructure.repository.JpaDoctorRepository;
import com.code2care.common.domain.model.DoctorDto;
import com.code2care.common.infrastructure.config.Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AuthenticationRepositoryImpl implements AuthenticationRepository {
    private final JpaDoctorRepository jpaDoctorRepository;

    @Override
    public void save(DoctorDto doctorDto) {
        jpaDoctorRepository.save(Mapper.mapDoctor(doctorDto));
    }

    @Override
    public Optional<DoctorDto> findByEmail(String email) {
        return jpaDoctorRepository.findByEmail(email)
                .map(Mapper::mapDoctorDto);
    }
}