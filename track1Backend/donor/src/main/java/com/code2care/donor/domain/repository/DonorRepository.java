package com.code2care.donor.domain.repository;

import com.code2care.common.domain.model.DonorDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DonorRepository {
    void save(DonorDto donorDto);
    Page<DonorDto> searchDonor(String fullName, String bloodType, String address, Pageable pageable);
}
