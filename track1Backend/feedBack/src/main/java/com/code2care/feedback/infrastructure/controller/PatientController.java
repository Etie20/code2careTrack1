package com.code2care.feedback.infrastructure.controller;

import com.code2care.common.domain.model.PatientDto;
import com.code2care.feedback.application.service.GetPatientsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PatientController {
    private final GetPatientsUseCase getPatientsUseCase;

    @GetMapping("/search")
    public ResponseEntity<List<PatientDto>> getPatients(@RequestParam String query) {
        return ResponseEntity.ok(getPatientsUseCase.execute(query));
    }
}
