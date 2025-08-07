package com.code2care.bloodUnit.application.service;

import com.code2care.bloodUnit.domain.repository.BloodUnitRepository;
import com.code2care.bloodUnit.domain.service.BloodUnitDomainService;
import com.code2care.common.domain.model.BloodStatDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GetBloodStatUseCase {
    private final BloodUnitDomainService bloodUnitDomainService;

    public GetBloodStatUseCase(BloodUnitDomainService bloodUnitDomainService) {
        this.bloodUnitDomainService = bloodUnitDomainService;
    }

    public List<BloodStatDto> execute() {
        try {
            return  bloodUnitDomainService.getBloodStats();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
