package com.code2care.auth.infrastructure.repository;

import com.code2care.common.infrastructure.entites.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaDoctorRepository extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByEmail(String email);
}
