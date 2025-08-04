package com.code2care.donor.infrastructure.repository;

import com.code2care.common.infrastructure.entites.BloodUnit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface JpaBloodUnitRepository extends JpaRepository<BloodUnit, String> {
    long countByExpirationDateBefore(Instant expirationDate);
}
