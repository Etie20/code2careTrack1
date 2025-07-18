package com.code2care.reminder.application.service;

import com.code2care.common.domain.model.ReminderDto;
import com.code2care.reminder.domain.repository.ReminderRepository;
import com.code2care.reminder.domain.service.ReminderDomainService;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetRemindersByDoctorIDUseCase extends ReminderUseCase {
    protected GetRemindersByDoctorIDUseCase(ReminderRepository reminderRepository, ReminderDomainService reminderDomainService) {
        super(reminderRepository, reminderDomainService);
    }

    List<ReminderDto> execute(int doctorId, Pageable pageable) {
        return reminderRepository.findAllByDoctorID(doctorId,pageable);
    }
}
