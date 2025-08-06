package com.code2care.demand.domain.repository;

import com.code2care.common.domain.model.DepartmentDto;
import com.code2care.common.domain.model.DepartmentNeedDto;
import com.code2care.demand.application.dto.DemandStatsDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;

public interface DemandRepository {
    void save(DepartmentNeedDto departmentNeedDto);
    Page<DepartmentNeedDto> search(String searchTerm, Pageable pageable);
    Page<DepartmentNeedDto> filter(String bloodType, Integer departmentId, String demandType, Instant from, Instant to, Pageable pageable);
    DemandStatsDto getDemandStats();
    List<DepartmentDto> getDepartments();
}
