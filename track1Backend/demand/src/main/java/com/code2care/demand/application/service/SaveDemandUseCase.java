package com.code2care.demand.application.service;

import com.code2care.common.domain.model.DepartmentNeedDto;
import com.code2care.demand.domain.service.DemandDomainService;
import org.springframework.stereotype.Component;

@Component
public class SaveDemandUseCase {
    private final DemandDomainService demandDomainService;

    public SaveDemandUseCase(DemandDomainService demandDomainService) {
        this.demandDomainService = demandDomainService;
    }

    public void execute(DepartmentNeedDto departmentNeedDto) {
        demandDomainService.save(departmentNeedDto);
    }
}
