package com.code2care.bloodUnit.infrastructure.repository;

import com.code2care.common.infrastructure.entites.BloodBankSummary;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface JpaBloodBanckSumaryStat extends Repository<BloodBankSummary, Long>, JpaSpecificationExecutor<BloodBankSummary> {
  @Query("SELECT b FROM BloodBankSummary b")
  BloodBankSummary find();
}