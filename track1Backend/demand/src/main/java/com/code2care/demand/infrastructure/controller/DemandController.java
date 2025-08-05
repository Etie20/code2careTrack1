package com.code2care.demand.infrastructure.controller;

import com.code2care.common.application.dto.PageResponse;
import com.code2care.common.domain.model.DepartmentDto;
import com.code2care.common.domain.model.DepartmentNeedDto;
import com.code2care.demand.application.dto.DemandStatsDto;
import com.code2care.demand.application.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@Controller
@RestController
@RequestMapping("/api/demand")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DemandController {

    private final SaveDemandUseCase saveDemandUseCase;
    private final SearchDemandUseCase searchDemandUseCase;
    private final FilterDemandUseCase filterDemandUseCase;
    private final GetDemandStatsUseCase getDemandStatsUseCase;
    private final GetDepartmentUseCase getDepartmentUseCase;

    @PostMapping("")
    public ResponseEntity<Object> createDemand(@RequestBody DepartmentNeedDto departmentNeedDto) {
        try {
            saveDemandUseCase.execute(departmentNeedDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<DepartmentNeedDto>> search(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false, defaultValue = "") String searchTerm
    ) {
        try {
            Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
            PageRequest pageRequest = PageRequest.of(page, size, sort);
            return ResponseEntity.ok(PageResponse.from(searchDemandUseCase.execute(searchTerm, pageRequest)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<PageResponse<DepartmentNeedDto>> filter(
            @RequestParam(required = false, defaultValue = "") String bloodType,
            @RequestParam(required = false, defaultValue = "") Integer departmentId,
            @RequestParam(required = false, defaultValue = "") String demandType,
            @RequestParam(required = false, defaultValue = "") Instant from,
            @RequestParam(required = false, defaultValue = "") Instant to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
            ) {
        try {
            Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
            PageRequest pageRequest = PageRequest.of(page, size, sort);
            return ResponseEntity.ok(PageResponse.from(filterDemandUseCase.execute(bloodType, departmentId, demandType, from, to, pageRequest)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<DemandStatsDto> getDemandStats() {
        try {
            return ResponseEntity.ok(getDemandStatsUseCase.execute());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDto>> getDepartments() {
        try {
            return ResponseEntity.ok(getDepartmentUseCase.execute());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
