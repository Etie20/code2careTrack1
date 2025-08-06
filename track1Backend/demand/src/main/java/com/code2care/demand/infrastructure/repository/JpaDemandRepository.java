package com.code2care.demand.infrastructure.repository;

import com.code2care.common.infrastructure.entites.DepartmentNeed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface JpaDemandRepository extends JpaRepository<DepartmentNeed, Integer> {
    Page<DepartmentNeed> findAllByBloodTypeContainingIgnoreCase(String bloodType, Pageable pageable);
    Page<DepartmentNeed> findAllByBloodTypeContainingIgnoreCaseOrIdOrDemandTypeContainingIgnoreCaseOrDueDateBetween(String bloodType, Integer departmentId, String demandType, Instant from, Instant to, Pageable pageable);

    long countAllByStatus(String status);
    long countAllByDueDateBetween(Instant from, Instant to);
}
