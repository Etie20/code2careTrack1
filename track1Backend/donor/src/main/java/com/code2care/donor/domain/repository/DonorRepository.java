package com.code2care.donor.domain.repository;

import com.code2care.common.domain.model.DonorDto;
import com.code2care.donor.application.dto.DashboardStatsDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface DonorRepository {
    void save(DonorDto donorDto);
    Page<DonorDto> filterDonor(String bloodType, LocalDate startDate, LocalDate endDate, Pageable pageable);
    Page<DonorDto> searchDonor(String searchTerm, Pageable pageable);
    DashboardStatsDto getDashboardStats();
}
