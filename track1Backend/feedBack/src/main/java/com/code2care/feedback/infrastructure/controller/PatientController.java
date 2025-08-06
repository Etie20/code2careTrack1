package com.code2care.feedback.infrastructure.controller;

import com.code2care.common.domain.model.PatientDto;
import com.code2care.feedback.application.service.GetPatientByFullNameUseCase;
import com.code2care.feedback.application.service.GetPatientsUseCase;
import com.code2care.feedback.application.service.SavePatientUseCase;
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
    private final GetPatientByFullNameUseCase getPatientByFullNameUseCase;
    private final SavePatientUseCase savePatientUseCase;

    @GetMapping("/search/phone")
    public ResponseEntity<PatientDto> getPatientsByPhone(@RequestParam String query) {
        return ResponseEntity.ok(getPatientsUseCase.execute(query));
    }

    @GetMapping("/search/fullName")
    public ResponseEntity<List<PatientDto>> getPatients(@RequestParam String query) {
        return ResponseEntity.ok(getPatientByFullNameUseCase.execute(query));
    }

    @PostMapping("")
    public ResponseEntity<PatientDto> savePatient(@RequestBody PatientDto patientDto) {
        try {
            return ResponseEntity.ok(savePatientUseCase.execute(patientDto));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

}
