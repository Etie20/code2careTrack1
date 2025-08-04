package com.code2care.donor.application.service;

import com.code2care.common.domain.model.DonorDto;
import com.code2care.donor.domain.service.DonorDomainService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class SearchDonorUseCase {
    private final DonorDomainService donorDomainService;

    public SearchDonorUseCase(DonorDomainService donorDomainService) {
        this.donorDomainService = donorDomainService;
    }

    public Page<DonorDto> execute(String fullName, String bloodType, String address, Pageable pageable) {
        return donorDomainService.searchDonor(fullName, bloodType, address, pageable);
    }
}
