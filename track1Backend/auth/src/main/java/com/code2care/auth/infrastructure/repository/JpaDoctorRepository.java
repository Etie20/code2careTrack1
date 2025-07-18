package com.code2care.auth.infrastructure.repository;

import com.code2care.common.infrastructure.entites.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaDoctorRepository extends JpaRepository<Doctor, Integer> {
}
