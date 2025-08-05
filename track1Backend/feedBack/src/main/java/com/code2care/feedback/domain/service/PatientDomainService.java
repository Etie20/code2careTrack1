package com.code2care.feedback.domain.service;

import com.code2care.common.domain.model.PatientDto;
import com.code2care.feedback.domain.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientDomainService {
    private final PatientRepository patientRepository;

    public PatientDto findByPhoneNumber(String fullName) {
        return patientRepository.findByPhoneNumber(fullName);
    }

    public List<PatientDto> findByFullName(String fullName) {
        return patientRepository.findAllPatients(fullName);
    }

    public PatientDto save(PatientDto patientDto) {
        return patientRepository.save(patientDto);
    }
}
