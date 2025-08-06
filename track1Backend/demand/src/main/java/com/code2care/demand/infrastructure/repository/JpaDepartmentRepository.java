package com.code2care.demand.infrastructure.repository;

import com.code2care.common.infrastructure.entites.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaDepartmentRepository extends JpaRepository<Department, Integer> {
}
