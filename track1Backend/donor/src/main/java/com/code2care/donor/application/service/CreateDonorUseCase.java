package com.code2care.donor.application.service;

import com.code2care.common.domain.model.DonorDto;
import com.code2care.donor.domain.service.DonorDomainService;
import org.springframework.stereotype.Component;

@Component
public class CreateDonorUseCase {
    private final DonorDomainService donorDomainService;

    public CreateDonorUseCase(DonorDomainService donorDomainService) {
        this.donorDomainService = donorDomainService;
    }

    public void execute(DonorDto donorDto) {
        donorDomainService.saveDonor(donorDto);
    }
}