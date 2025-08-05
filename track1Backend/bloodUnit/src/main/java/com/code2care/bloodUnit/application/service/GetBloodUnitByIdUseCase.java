package com.code2care.bloodUnit.application.service;

import com.code2care.bloodUnit.domain.service.BloodUnitDomainService;
import com.code2care.common.domain.model.BloodUnitDto;
import org.springframework.stereotype.Component;

@Component
public class GetBloodUnitByIdUseCase {
    private final BloodUnitDomainService bloodUnitDomainService;

    public GetBloodUnitByIdUseCase(BloodUnitDomainService bloodUnitDomainService) {
        this.bloodUnitDomainService = bloodUnitDomainService;
    }

    public BloodUnitDto execute(Long id) {
        return bloodUnitDomainService.getById(id);
    }
}
