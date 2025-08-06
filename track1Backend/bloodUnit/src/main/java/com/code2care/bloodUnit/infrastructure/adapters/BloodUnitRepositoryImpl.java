package com.code2care.bloodUnit.infrastructure.adapters;

import com.code2care.bloodUnit.application.dto.StockSummaryDTO;
import com.code2care.bloodUnit.domain.repository.BloodUnitRepository;
import com.code2care.bloodUnit.infrastructure.repository.JpaBloodUnitRepository;
import com.code2care.common.domain.model.BloodUnitDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Repository
public class BloodUnitRepositoryImpl implements BloodUnitRepository {
    private final JpaBloodUnitRepository jpaBloodUnitRepository;
    private final ModelMapper modelMapper;

    public BloodUnitRepositoryImpl(JpaBloodUnitRepository jpaBloodUnitRepository, @Qualifier("bloodUnitModelMapper") ModelMapper modelMapper) {
        this.jpaBloodUnitRepository = jpaBloodUnitRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public void save(BloodUnitDto bloodUnitDto) {
        jpaBloodUnitRepository.save(modelMapper.map(bloodUnitDto, com.code2care.common.infrastructure.entites.BloodUnit.class));
    }

    @Override
    public Page<BloodUnitDto> search(String searchTerm, Pageable pageable) {
        return jpaBloodUnitRepository.findAllByBloodTypeContainingIgnoreCaseOrUnitIdOrStorageLocationContainingIgnoreCase(searchTerm, Long.parseLong(searchTerm), searchTerm, pageable).map((element) -> modelMapper.map(element, BloodUnitDto.class));
    }

    @Override
    public List<BloodUnitDto> findAll() {
        return jpaBloodUnitRepository.findAll().stream().map((element) -> modelMapper.map(element, BloodUnitDto.class)).toList();
    }

    @Override
    public BloodUnitDto getById(Long id) {
        return jpaBloodUnitRepository.findById(id).map((element) -> modelMapper.map(element, BloodUnitDto.class)).orElse(null);
    }

    @Override
    public Page<BloodUnitDto> filter(String bloodType, String storageLocation, Instant startDate, Instant endDate, Pageable pageable) {
        return jpaBloodUnitRepository.findAllByBloodTypeContainingIgnoreCaseOrStorageLocationContainingIgnoreCaseOrExpirationDateBetween(bloodType, storageLocation, startDate, endDate, pageable).map((element) -> modelMapper.map(element, BloodUnitDto.class));
    }

    @Override
    public StockSummaryDTO getStockSummary() {
        Instant now = Instant.now();
        Instant sevenDaysLater = now.plus(7, ChronoUnit.DAYS);
        Instant thirtyDaysLater = now.plus(30, ChronoUnit.DAYS);

        long totalUnits = jpaBloodUnitRepository.count();

        long expiringSoonStocks = jpaBloodUnitRepository.countByExpirationDateBetween(
                sevenDaysLater.plus(1, ChronoUnit.SECONDS), thirtyDaysLater);

        long criticalStocks = jpaBloodUnitRepository.countByExpirationDateBetween(now, sevenDaysLater);

        long normalStocks = jpaBloodUnitRepository.countByExpirationDateAfter(thirtyDaysLater);

        return new StockSummaryDTO(
                totalUnits,
                criticalStocks,
                expiringSoonStocks,
                normalStocks
        );
    }
}
