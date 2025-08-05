package com.code2care.donor.infrastructure.controller;

import com.code2care.common.application.dto.PageResponse;
import com.code2care.common.domain.model.DonorDto;
import com.code2care.donor.application.dto.DashboardStatsDto;
import com.code2care.donor.application.service.CreateDonorUseCase;
import com.code2care.donor.application.service.FilterDonorUseCase;
import com.code2care.donor.application.service.GetDashboardUseCase;
import com.code2care.donor.application.service.SearchDonorUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Controller
@RestController
@RequestMapping("/api/donor")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DonorController {
    private final SearchDonorUseCase searchDonorUseCase;
    private final CreateDonorUseCase createDonorUseCase;
    private final FilterDonorUseCase filterDonorUseCase;
    private final GetDashboardUseCase getDashboardUseCase;

    @GetMapping("/filter")
    public ResponseEntity<PageResponse<DonorDto>> searchDonor(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastDonationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false, defaultValue = "") String bloodType,
            @RequestParam(required = false, name = "from", defaultValue = "") @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate fromDate,
            @RequestParam(required = false, name = "to", defaultValue = "") @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate toDate

    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        try {
            PageResponse<DonorDto> response = PageResponse.from(filterDonorUseCase.execute(bloodType, fromDate, toDate, pageRequest));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<Object> saveDonor(@RequestBody DonorDto donorDto) {
        try {
            createDonorUseCase.execute(donorDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<DonorDto>> searchDonor(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastDonationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false, defaultValue = "") String query
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        try {
            PageResponse<DonorDto> response = PageResponse.from(searchDonorUseCase.execute(query, pageRequest));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        try {
            return ResponseEntity.ok(getDashboardUseCase.execute());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
