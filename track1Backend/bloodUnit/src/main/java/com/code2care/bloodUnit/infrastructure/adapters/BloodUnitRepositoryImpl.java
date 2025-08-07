package com.code2care.bloodUnit.infrastructure.adapters;

import com.code2care.analytics.infrastructure.config.WebSocketHandlerCare;
import com.code2care.bloodUnit.application.dto.StockSummaryDTO;
import com.code2care.bloodUnit.domain.repository.BloodUnitRepository;
import com.code2care.bloodUnit.infrastructure.repository.JpaBloodBanckSumaryStat;
import com.code2care.bloodUnit.infrastructure.repository.JpaBloodStatRepository;
import com.code2care.bloodUnit.infrastructure.repository.JpaBloodUnitRepository;
import com.code2care.common.domain.model.BloodBankSummaryDto;
import com.code2care.common.domain.model.BloodStatDto;
import com.code2care.common.domain.model.BloodUnitDto;
import com.code2care.common.infrastructure.entites.BloodBankSummary;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public  class BloodUnitRepositoryImpl implements BloodUnitRepository {
    private final JpaBloodUnitRepository jpaBloodUnitRepository;
    private final JpaBloodStatRepository jpaBloodStatRepository;
    private final JpaBloodBanckSumaryStat jpaBloodBanckSumaryStat;
    private final WebSocketHandlerCare webSocketHandlerCare;
    private final ModelMapper modelMapper;

    public BloodUnitRepositoryImpl(JpaBloodUnitRepository jpaBloodUnitRepository, JpaBloodStatRepository jpaBloodStatRepository, JpaBloodBanckSumaryStat jpaBloodBanckSumaryStat, WebSocketHandlerCare webSocketHandlerCare, @Qualifier("bloodUnitModelMapper") ModelMapper modelMapper) {
        this.jpaBloodUnitRepository = jpaBloodUnitRepository;
        this.jpaBloodStatRepository = jpaBloodStatRepository;
        this.jpaBloodBanckSumaryStat = jpaBloodBanckSumaryStat;
        this.webSocketHandlerCare = webSocketHandlerCare;
        this.modelMapper = modelMapper;
    }

    @Override
    public void save(BloodUnitDto bloodUnitDto) throws JsonProcessingException {
        jpaBloodUnitRepository.save(modelMapper.map(bloodUnitDto, com.code2care.common.infrastructure.entites.BloodUnit.class));
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(modelMapper.map(getBloodBankSummary(), BloodBankSummary.class));
        webSocketHandlerCare.send(json);
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

    @Override
    public List<BloodStatDto> getBloodStat() {
        try{
            return jpaBloodStatRepository.findAll().stream().map((element) -> modelMapper.map(element, BloodStatDto.class)).collect(Collectors.toList());
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public BloodBankSummaryDto getBloodBankSummary() {
        try{

            return modelMapper.map(jpaBloodBanckSumaryStat.find(), BloodBankSummaryDto.class);

        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
