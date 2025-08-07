package com.code2care.feedback.domain.repository;

import com.code2care.common.domain.model.PatientDto;

import java.util.List;

public interface PatientRepository {
    PatientDto findByPhoneNumber(String phoneNumber);
    List<PatientDto> findAllPatients(String fullName);

    PatientDto save(PatientDto patientDto);

}
