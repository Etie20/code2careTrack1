package com.code2care.feedback.application.service;

import com.code2care.common.domain.model.PatientDto;
import com.code2care.feedback.domain.service.PatientDomainService;
import org.springframework.stereotype.Component;

@Component
public class SavePatientUseCase {
    private final PatientDomainService patientDomainService;

    public SavePatientUseCase(PatientDomainService patientDomainService) {
        this.patientDomainService = patientDomainService;
    }

    public PatientDto excute (PatientDto patientDto) {
        return patientDomainService.save(patientDto);
    }

}
