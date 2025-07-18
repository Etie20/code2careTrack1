package com.code2care.feedback.infrastructure.repository;

import com.code2care.common.infrastructure.entites.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JpaFeebackRepository extends JpaRepository<Feedback, Integer> {
    Page<Feedback> findAll(Pageable pageable);
    List<Feedback> findTop3ByOrderBySubmittedAtDesc();
}
