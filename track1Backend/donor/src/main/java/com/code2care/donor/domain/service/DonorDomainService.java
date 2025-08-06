package com.code2care.donor.domain.service;

import com.code2care.common.domain.model.DonorDto;
import com.code2care.donor.application.dto.DashboardStatsDto;
import com.code2care.donor.domain.repository.DonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DonorDomainService {
    private final DonorRepository donorRepository;

    public void saveDonor(DonorDto donorDto) {
        donorRepository.save(donorDto);
    }

    public Page<DonorDto> filterDonor(String bloodType, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return donorRepository.filterDonor(bloodType, startDate, endDate, pageable);
    }

    public Page<DonorDto> searchDonor(String searchTerm, Pageable pageable) {
        return donorRepository.searchDonor(searchTerm, pageable);
    }

    public DashboardStatsDto getDashboardStats() {
        return donorRepository.getDashboardStats();
    }
}
