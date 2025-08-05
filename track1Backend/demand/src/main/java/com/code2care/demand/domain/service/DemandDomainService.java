package com.code2care.demand.domain.service;

import com.code2care.common.domain.model.DepartmentDto;
import com.code2care.common.domain.model.DepartmentNeedDto;
import com.code2care.demand.application.dto.DemandStatsDto;
import com.code2care.demand.domain.repository.DemandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DemandDomainService {
    private final DemandRepository demandRepository;

    public void save(DepartmentNeedDto departmentNeedDto) {
        demandRepository.save(departmentNeedDto);
    }

    public Page<DepartmentNeedDto> search(String searchText, Pageable pageable) {
        return demandRepository.search(searchText, pageable);
    }

    public Page<DepartmentNeedDto> filter(String bloodType, Integer departmentId, String demandType, Instant from, Instant to, Pageable pageable) {
        return demandRepository.filter(bloodType, departmentId, demandType, from, to, pageable);
    }

    public DemandStatsDto getDemandStats() {
        return demandRepository.getDemandStats();
    }

    public List<DepartmentDto> getDepartments() {
        return demandRepository.getDepartments();
    }
}
