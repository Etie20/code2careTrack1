package com.code2care.bloodUnit.application.service;

import com.code2care.bloodUnit.domain.service.BloodUnitDomainService;
import com.code2care.common.domain.model.BloodUnitDto;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
public class CreateBloodUnitUseCase {
    private final BloodUnitDomainService bloodUnitDomainService;

    public CreateBloodUnitUseCase(BloodUnitDomainService bloodUnitDomainService) {
        this.bloodUnitDomainService = bloodUnitDomainService;
    }

    public void execute(BloodUnitDto bloodUnitDto) {
        bloodUnitDomainService.save(bloodUnitDto);
    }
}
