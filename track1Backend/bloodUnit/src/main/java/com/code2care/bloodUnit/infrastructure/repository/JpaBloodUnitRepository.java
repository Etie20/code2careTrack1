package com.code2care.bloodUnit.infrastructure.repository;

import com.code2care.common.infrastructure.entites.BloodUnit;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface JpaBloodUnitRepository extends JpaRepository<BloodUnit, Long> {
    Page<BloodUnit> findAllByBloodTypeContainingIgnoreCaseOrStorageLocationContainingIgnoreCaseOrExpirationDateBetween(String bloodType, String storageLocation, java.time.Instant startDate, java.time.Instant endDate, org.springframework.data.domain.Pageable pageable);
    Page<BloodUnit> findAllByBloodTypeContainingIgnoreCaseOrUnitIdOrStorageLocationContainingIgnoreCase(String bloodType, Long unitId, String storageLocation, org.springframework.data.domain.Pageable pageable);
    long countByExpirationDateBefore(Instant endDate);
    long countByExpirationDateBetween(Instant startDate, Instant endDate);
    long countByExpirationDateAfter(Instant endDate);
}
