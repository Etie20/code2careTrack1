package com.code2care.demand.infrastructure.adapters;

import com.code2care.common.domain.model.DepartmentDto;
import com.code2care.common.domain.model.DepartmentNeedDto;
import com.code2care.common.infrastructure.entites.DepartmentNeed;
import com.code2care.demand.application.dto.DemandStatsDto;
import com.code2care.demand.domain.repository.DemandRepository;
import com.code2care.demand.infrastructure.repository.JpaDemandRepository;
import com.code2care.demand.infrastructure.repository.JpaDepartmentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class DemandRepositoryImpl implements DemandRepository {
    private final JpaDemandRepository jpaDemandRepository;
    private final JpaDepartmentRepository jpaDepartmentRepository;
    private final ModelMapper modelMapper;

    public DemandRepositoryImpl(JpaDemandRepository jpaDemandRepository, JpaDepartmentRepository jpaDepartmentRepository, @Qualifier("demandModelMapper") ModelMapper modelMapper) {
        this.jpaDemandRepository = jpaDemandRepository;
        this.jpaDepartmentRepository = jpaDepartmentRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public void save(DepartmentNeedDto departmentNeedDto) {
        jpaDemandRepository.save(modelMapper.map(departmentNeedDto, DepartmentNeed.class));
    }

    @Override
    public Page<DepartmentNeedDto> search(String searchTerm, Pageable pageable) {
        return jpaDemandRepository.findAllByBloodTypeContainingIgnoreCase(searchTerm, pageable).map((element) -> modelMapper.map(element, DepartmentNeedDto.class));
    }

    @Override
    public Page<DepartmentNeedDto> filter(String bloodType, Integer departmentId, String demandType, Instant from, Instant to, Pageable pageable) {
        return jpaDemandRepository.findAllByBloodTypeContainingIgnoreCaseOrIdOrDemandTypeContainingIgnoreCaseOrDueDateBetween(bloodType, departmentId, demandType, from, to, pageable).map((element) -> modelMapper.map(element, DepartmentNeedDto.class));
    }

    @Override
    public DemandStatsDto getDemandStats() {
        long totalRequests = jpaDemandRepository.count();
        long pendingRequests = jpaDemandRepository.countAllByStatus("pending");
        long emergencyRequests = jpaDemandRepository.countAllByDueDateBetween(Instant.now().minusSeconds(3600 * 3), Instant.now());
        long unitsRequested = jpaDemandRepository.count();

        return new DemandStatsDto(totalRequests, pendingRequests, emergencyRequests, unitsRequested);
    }

    @Override
    public List<DepartmentDto> getDepartments() {
        return jpaDepartmentRepository.findAll().stream().map((element) -> modelMapper.map(element, DepartmentDto.class)).collect(Collectors.toList());
    }
}
