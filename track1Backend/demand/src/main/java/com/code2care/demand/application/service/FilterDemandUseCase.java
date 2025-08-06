package com.code2care.demand.application.service;

import com.code2care.common.domain.model.DepartmentNeedDto;
import com.code2care.demand.domain.service.DemandDomainService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class FilterDemandUseCase {
    private final DemandDomainService demandDomainService;

    public FilterDemandUseCase(DemandDomainService demandDomainService) {
        this.demandDomainService = demandDomainService;
    }

    public Page<DepartmentNeedDto> execute(String bloodType, Integer departmentId, String demandType, Instant from, Instant to, Pageable pageable) {
        return demandDomainService.filter(bloodType, departmentId, demandType, from, to, pageable);
    }
}
