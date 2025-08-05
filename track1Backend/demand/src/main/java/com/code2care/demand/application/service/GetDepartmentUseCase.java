package com.code2care.demand.application.service;

import com.code2care.common.domain.model.DepartmentDto;
import com.code2care.demand.domain.service.DemandDomainService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GetDepartmentUseCase {
    private final DemandDomainService demandDomainService;

    public GetDepartmentUseCase(DemandDomainService demandDomainService) {
        this.demandDomainService = demandDomainService;
    }

    public List<DepartmentDto> execute() {
        return demandDomainService.getDepartments();
    }
}
