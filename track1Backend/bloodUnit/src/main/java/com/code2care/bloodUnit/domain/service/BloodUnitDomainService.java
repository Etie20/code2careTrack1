package com.code2care.bloodUnit.domain.service;

import com.code2care.bloodUnit.application.dto.StockSummaryDTO;
import com.code2care.bloodUnit.domain.repository.BloodUnitRepository;
import com.code2care.common.domain.model.BloodBankSummaryDto;
import com.code2care.common.domain.model.BloodStatDto;
import com.code2care.common.domain.model.BloodUnitDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BloodUnitDomainService {
    private final BloodUnitRepository bloodUnitRepository;

    public void save(BloodUnitDto bloodUnitDto) throws JsonProcessingException {
        bloodUnitRepository.save(bloodUnitDto);
    }

    public Page<BloodUnitDto> search(String searchTerm, Pageable pageable) {
        return bloodUnitRepository.search(searchTerm, pageable);
    }

    public BloodUnitDto getById(Long id) {
        return bloodUnitRepository.getById(id);
    }

    public Page<BloodUnitDto> filter(String bloodType, String storageLocation, java.time.Instant startDate, java.time.Instant endDate, Pageable pageable) {
        return bloodUnitRepository.filter(bloodType, storageLocation, startDate, endDate, pageable);
    }

    public StockSummaryDTO getStockSummary() {
        return bloodUnitRepository.getStockSummary();
    }

    public List<BloodStatDto> getBloodStats() {
        return bloodUnitRepository.getBloodStat();
    }

    public BloodBankSummaryDto getBloodBanckSumary() {
        return bloodUnitRepository.getBloodBankSummary();
    }

    public List<BloodUnitDto> getBloodUnits() {
        return bloodUnitRepository.findAll();
    }
}
