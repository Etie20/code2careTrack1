package com.code2care.donor.infrastructure.repository;

import com.code2care.common.infrastructure.entites.Donor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface JpaDonorRepository extends JpaRepository<Donor, Integer> {
    Page<Donor> findAllByFullNameContainingIgnoreCaseOrBloodTypeContainingIgnoreCaseOrAddressContainingIgnoreCase(String fullName, String bloodType, String address, Pageable pageable);
    Page<Donor> findAllByBloodTypeContainingOrLastDonationDateBetween(String bloodType, LocalDate startDate, LocalDate endDate, Pageable pageable);
    long countByLastDonationDateBefore(LocalDate lastDonationDateBefore);
}
