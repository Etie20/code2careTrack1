package com.code2care.donor.infrastructure.controller;

import com.code2care.common.domain.model.DonorDto;
import com.code2care.donor.application.dto.PageResponse;
import com.code2care.donor.application.service.SearchDonorUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequestMapping("/api/donor")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DonorController {
    private final SearchDonorUseCase searchDonorUseCase;

    @RequestMapping("/search")
    public ResponseEntity<PageResponse<DonorDto>> searchDonor(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastDonationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false, defaultValue = "") String fullName,
            @RequestParam(required = false, defaultValue = "") String bloodType,
            @RequestParam(required = false, defaultValue = "") String address
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        try {
            return ResponseEntity.ok(PageResponse.from(searchDonorUseCase.execute(fullName, bloodType, address, pageRequest)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
