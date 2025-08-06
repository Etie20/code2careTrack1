package com.code2care.demand.application.service;

import com.code2care.demand.application.dto.DemandStatsDto;
import com.code2care.demand.domain.service.DemandDomainService;
import org.springframework.stereotype.Component;

@Component
public class GetDemandStatsUseCase {
    private final DemandDomainService demandDomainService;

    public GetDemandStatsUseCase(DemandDomainService demandDomainService) {
        this.demandDomainService = demandDomainService;
    }

    public DemandStatsDto execute() {
        return demandDomainService.getDemandStats();
    }
}
