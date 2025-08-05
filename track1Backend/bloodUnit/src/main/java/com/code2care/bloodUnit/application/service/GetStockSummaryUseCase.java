package com.code2care.bloodUnit.application.service;

import com.code2care.bloodUnit.application.dto.StockSummaryDTO;
import com.code2care.bloodUnit.domain.service.BloodUnitDomainService;
import org.springframework.stereotype.Component;

@Component
public class GetStockSummaryUseCase {
    private final BloodUnitDomainService bloodUnitDomainService;

    public GetStockSummaryUseCase(BloodUnitDomainService bloodUnitDomainService) {
        this.bloodUnitDomainService = bloodUnitDomainService;
    }

    public StockSummaryDTO execute() {
        return bloodUnitDomainService.getStockSummary();
    }
}
