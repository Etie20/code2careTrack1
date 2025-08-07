package com.code2care.bloodUnit.application.service;

import com.code2care.bloodUnit.domain.service.BloodUnitDomainService;
import com.code2care.common.domain.model.BloodBankSummaryDto;
import org.springframework.stereotype.Component;

@Component
public class GetBloodBackSummaryStatUseCase {
    private final BloodUnitDomainService bloodUnitDomainService;

    public GetBloodBackSummaryStatUseCase(BloodUnitDomainService bloodUnitDomainService) {
        this.bloodUnitDomainService = bloodUnitDomainService;
    }

    public BloodBankSummaryDto execute() {
        try {
            return  bloodUnitDomainService.getBloodBanckSumary();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
