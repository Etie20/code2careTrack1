package com.code2care.reminder.infrastructure.controller;

import com.code2care.common.domain.model.ReminderDto;
import com.code2care.common.infrastructure.entites.Reminder;
import com.code2care.reminder.application.service.CreateReminderUseCase;
import com.code2care.reminder.application.service.GetReminderUseCaseByDoctorIDAndType;
import com.code2care.reminder.application.service.GetRemindersByDoctorIDUseCase;
import com.code2care.reminder.domain.exeption.ReminderTypeNotExist;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("reminder")
@CrossOrigin("*")
class ReminderController {
    private final GetRemindersByDoctorIDUseCase getRemindersByDoctorIDUseCase;
    private final GetReminderUseCaseByDoctorIDAndType getReminderUseCaseByDoctorIDAndType;
    private final CreateReminderUseCase createReminderUseCase;

    ReminderController(GetRemindersByDoctorIDUseCase getRemindersByDoctorIDUseCase, GetReminderUseCaseByDoctorIDAndType getReminderUseCaseByDoctorIDAndType, CreateReminderUseCase createReminderUseCase) {
        this.getRemindersByDoctorIDUseCase = getRemindersByDoctorIDUseCase;
        this.getReminderUseCaseByDoctorIDAndType = getReminderUseCaseByDoctorIDAndType;
        this.createReminderUseCase = createReminderUseCase;
    }

    @GetMapping("{doctorID}/{type}")
    ResponseEntity getRemindersByDoctorID(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @PathVariable() int doctorID,
            @PathVariable() String type
    ) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
        var result =    getReminderUseCaseByDoctorIDAndType.execute(doctorID, type, pageRequest);
        return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error(e.getMessage());
            ResponseEntity.badRequest().body(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }



    }
    @GetMapping("{doctorID}")
    ResponseEntity getRemindersByDoctorId(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "type") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @PathVariable() int doctorID
    ){
        try {
            Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
            PageRequest pageRequest = PageRequest.of(page, size, sort);
            var result =    getRemindersByDoctorIDUseCase.execute(doctorID, pageRequest);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("")
    ResponseEntity createReminder(@RequestBody ReminderDto reminder) {
        try{
            createReminderUseCase.execute(reminder);
            return ResponseEntity.status(HttpStatus.CREATED).body(reminder);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
