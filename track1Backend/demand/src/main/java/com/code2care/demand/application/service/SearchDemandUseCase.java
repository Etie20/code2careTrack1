package com.code2care.demand.application.service;

import com.code2care.common.domain.model.DepartmentNeedDto;
import com.code2care.demand.domain.service.DemandDomainService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class SearchDemandUseCase {
    private final DemandDomainService demandDomainService;

    public SearchDemandUseCase(DemandDomainService demandDomainService) {
        this.demandDomainService = demandDomainService;
    }

    public Page<DepartmentNeedDto> execute(String searchTerm, Pageable pageable) {
        return demandDomainService.search(searchTerm, pageable);
    }
}
