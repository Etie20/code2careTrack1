package com.code2care.feedback.domain.repository;

import com.code2care.common.domain.model.PatientDto;

import java.util.List;

public interface PatientRepository {
    List<PatientDto> findByFullName(String fullName);
}
