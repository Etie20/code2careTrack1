package com.code2care.bloodUnit.domain.repository;

import com.code2care.bloodUnit.application.dto.StockSummaryDTO;
import com.code2care.common.domain.model.BloodBankSummaryDto;
import com.code2care.common.domain.model.BloodStatDto;
import com.code2care.common.domain.model.BloodUnitDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public interface BloodUnitRepository {
    public void save(BloodUnitDto bloodUnitDto) throws JsonProcessingException;
    public Page<BloodUnitDto> search(String searchTerm, Pageable pageable);
    public BloodUnitDto getById(Long id);
    public Page<BloodUnitDto> filter(String bloodType, String storageLocation, Instant startDate, Instant endDate, Pageable pageable);
    public StockSummaryDTO getStockSummary();
    public List<BloodStatDto> getBloodStat();

    public BloodBankSummaryDto getBloodBankSummary();
}
