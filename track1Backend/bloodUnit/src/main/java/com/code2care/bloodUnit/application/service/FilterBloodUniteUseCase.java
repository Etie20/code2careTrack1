package com.code2care.bloodUnit.application.service;

import com.code2care.bloodUnit.domain.service.BloodUnitDomainService;
import com.code2care.common.domain.model.BloodUnitDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class FilterBloodUniteUseCase {
    private final BloodUnitDomainService bloodUnitDomainService;

    public FilterBloodUniteUseCase(BloodUnitDomainService bloodUnitDomainService) {
        this.bloodUnitDomainService = bloodUnitDomainService;
    }

    public Page<BloodUnitDto> execute(String bloodType, String storageLocation, java.time.Instant startDate, java.time.Instant endDate, Pageable pageable) {
       return bloodUnitDomainService.filter(bloodType, storageLocation, startDate, endDate, pageable);
    }
}
