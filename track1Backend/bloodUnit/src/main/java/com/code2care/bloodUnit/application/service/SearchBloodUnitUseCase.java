package com.code2care.bloodUnit.application.service;

import com.code2care.bloodUnit.domain.service.BloodUnitDomainService;
import com.code2care.common.domain.model.BloodUnitDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class SearchBloodUnitUseCase {
    private final BloodUnitDomainService bloodUnitDomainService;

    public SearchBloodUnitUseCase(BloodUnitDomainService bloodUnitDomainService) {
        this.bloodUnitDomainService = bloodUnitDomainService;
    }

    public Page<BloodUnitDto> execute(String searchTerm, Pageable pageable) {
        return bloodUnitDomainService.search(searchTerm, pageable);
    }
}
