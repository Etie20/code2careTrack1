package com.code2care.feedback.infrastructure.repository;

import com.code2care.common.infrastructure.entites.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JpaPatientRepository extends JpaRepository<Patient, Integer> {
    List<Patient> findByFullNameContainingIgnoreCase(String fullName);

    List<Patient> findByPhoneNumberContainingIgnoreCase(String fullName);
}
