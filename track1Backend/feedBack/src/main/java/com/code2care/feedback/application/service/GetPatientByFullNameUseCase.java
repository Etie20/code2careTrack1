package com.code2care.feedback.application.service;

import com.code2care.common.domain.model.PatientDto;
import com.code2care.feedback.domain.service.PatientDomainService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GetPatientByFullNameUseCase {
    private final PatientDomainService patientDomainService;

    public GetPatientByFullNameUseCase(PatientDomainService patientDomainService) {
        this.patientDomainService = patientDomainService;
    }

    public List<PatientDto> execute(String fullName) {
        return patientDomainService.findByFullName(fullName);
    }
}
