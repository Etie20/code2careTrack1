package com.code2care.bloodUnit.application.service;

import com.code2care.bloodUnit.domain.service.BloodUnitDomainService;
import com.code2care.common.domain.model.BloodUnitDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GetBloodUnitsUseCase {
    private final BloodUnitDomainService bloodUnitDomainService;

    public GetBloodUnitsUseCase(BloodUnitDomainService bloodUnitDomainService) {
        this.bloodUnitDomainService = bloodUnitDomainService;
    }

    public List<BloodUnitDto> execute() {
        return bloodUnitDomainService.getBloodUnits();
    }
}
