package com.code2care.feedback.application.service;

import com.code2care.common.domain.model.PatientDto;
import com.code2care.feedback.domain.service.PatientDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetPatientsUseCase {
    private final PatientDomainService patientDomainService;

    public PatientDto execute(String fullName) {
        return patientDomainService.findByPhoneNumber(fullName);
    }
}
