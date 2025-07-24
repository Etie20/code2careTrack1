package com.code2care.feedback.infrastructure.adapters;

import com.code2care.common.domain.model.PatientDto;
import com.code2care.common.infrastructure.config.Mapper;
import com.code2care.feedback.domain.repository.PatientRepository;
import com.code2care.feedback.infrastructure.repository.JpaPatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PatientRepositoryImpl implements PatientRepository {
    private final JpaPatientRepository jpaPatientRepository;
    @Override
    public PatientDto findByPhoneNumber(String phoneNumber) {
        return Mapper.mapPatientDto(jpaPatientRepository.findByPhoneNumberContainingIgnoreCase(phoneNumber));
    }

    @Override
    public List<PatientDto> findAllPatients(String fullName) {
        return Mapper.mapPatientDtos(jpaPatientRepository.findByFullNameContainingIgnoreCase(fullName));
    }
}
