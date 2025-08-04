package com.code2care.donor.domain.service;

import com.code2care.common.domain.model.DonorDto;
import com.code2care.donor.domain.repository.DonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DonorDomainService {
    private final DonorRepository donorRepository;

    public void saveDonor(DonorDto donorDto) {
        donorRepository.save(donorDto);
    }

    public Page<DonorDto> searchDonor(String fullName, String bloodType, String address, Pageable pageable) {
        return donorRepository.searchDonor(fullName, bloodType, address, pageable);
    }
}
