package com.code2care.donor.application.service;

import com.code2care.common.domain.model.DonorDto;
import com.code2care.donor.domain.service.DonorDomainService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class FilterDonorUseCase {
    private final DonorDomainService donorDomainService;

    public FilterDonorUseCase(DonorDomainService donorDomainService) {
        this.donorDomainService = donorDomainService;
    }

    public Page<DonorDto> execute(String bloodType, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return donorDomainService.filterDonor(bloodType, startDate, endDate, pageable);
    }
}
