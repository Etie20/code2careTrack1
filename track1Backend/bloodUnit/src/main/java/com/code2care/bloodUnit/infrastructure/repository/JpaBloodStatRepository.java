package com.code2care.bloodUnit.infrastructure.repository;

import com.code2care.common.infrastructure.entites.BloodStat;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface JpaBloodStatRepository extends Repository<BloodStat, String> {

  List<BloodStat> findAll();
}