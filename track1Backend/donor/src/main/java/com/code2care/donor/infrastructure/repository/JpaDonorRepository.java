package com.code2care.donor.infrastructure.repository;

import com.code2care.common.infrastructure.entites.Donor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaDonorRepository extends JpaRepository<Donor, Integer> {
    Page<Donor> findAllByFullNameOrBloodTypeOrAddress(String fullName, String bloodType, String address, Pageable pageable);
}
