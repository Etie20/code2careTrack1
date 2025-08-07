package com.code2care.bloodUnit.infrastructure.controller;

import com.code2care.bloodUnit.application.dto.StockSummaryDTO;
import com.code2care.bloodUnit.application.service.*;
import com.code2care.common.application.dto.PageResponse;
import com.code2care.common.domain.model.BloodBankSummaryDto;
import com.code2care.common.domain.model.BloodStatDto;
import com.code2care.common.domain.model.BloodUnitDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Controller
@RestController
@RequestMapping("/api/bloodUnit")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BloodUnitController {
    private final CreateBloodUnitUseCase createBloodUnitUseCase;
    private final FilterBloodUniteUseCase filterBloodUniteUseCase;
    private final SearchBloodUnitUseCase searchBloodUnitUseCase;
    private final GetBloodUnitByIdUseCase getBloodUnitByIdUseCase;
    private final GetStockSummaryUseCase getStockSummaryUseCase;
    private final GetBloodStatUseCase getBloodStatUseCase;
    private final GetBloodBackSummaryStatUseCase getBloodBackSummaryStatUseCase;
    private final GetBloodUnitsUseCase getBloodUnitsUseCase;
    @PostMapping("")
    public ResponseEntity<Object> create(@RequestBody BloodUnitDto bloodUnitDto) {
        try {
            createBloodUnitUseCase.execute(bloodUnitDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<PageResponse<BloodUnitDto>> filter(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "collectionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false, defaultValue = "") String bloodType,
            @RequestParam(required = false, defaultValue = "") String storageLocation,
            @RequestParam(required = false, defaultValue = "") java.time.Instant startDate,
            @RequestParam(required = false, defaultValue = "") java.time.Instant endDate
            ) {
        try {
            Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
            PageRequest pageRequest = PageRequest.of(page, size, sort);
            PageResponse<BloodUnitDto> response = PageResponse.from(filterBloodUniteUseCase.execute(bloodType, storageLocation, startDate, endDate, pageRequest));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<BloodUnitDto>> search(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "collectionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false, defaultValue = "1") String query
    ) {
        try {
            Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
            PageRequest pageRequest = PageRequest.of(page, size, sort);
            PageResponse<BloodUnitDto> response = PageResponse.from(searchBloodUnitUseCase.execute(query, pageRequest));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodUnitDto> getById(@PathVariable Long id) {
        try {
            BloodUnitDto unit = getBloodUnitByIdUseCase.execute(id);
            return ResponseEntity.ok(unit);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<StockSummaryDTO> getSummary() {
        try {
            return ResponseEntity.ok(getStockSummaryUseCase.execute());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("stat")
    public ResponseEntity<List<BloodStatDto>> getStat() {
        try {

            return ResponseEntity.ok(getBloodStatUseCase.execute());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("banckSummary")
    public ResponseEntity<BloodBankSummaryDto> getBankSummary() {
        try{
            return ResponseEntity.ok(getBloodBackSummaryStatUseCase.execute());
        }catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("")
    public ResponseEntity<List<BloodUnitDto>> getBloodUnits() {
        try {
            return ResponseEntity.ok(getBloodUnitsUseCase.execute());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
