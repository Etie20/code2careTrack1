package com.code2care.donor.application.service;

import com.code2care.donor.application.dto.DashboardStatsDto;
import com.code2care.donor.domain.service.DonorDomainService;
import org.springframework.stereotype.Component;

@Component
public class GetDashboardUseCase {
    private final DonorDomainService donorDomainService;

    public GetDashboardUseCase(DonorDomainService donorDomainService) {
        this.donorDomainService = donorDomainService;
    }

    public DashboardStatsDto execute() {
        return donorDomainService.getDashboardStats();
    }
}
