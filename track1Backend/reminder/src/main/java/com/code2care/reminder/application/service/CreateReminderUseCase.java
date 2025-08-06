package com.code2care.reminder.application.service;

import com.code2care.common.domain.model.ReminderDto;
import com.code2care.reminder.domain.repository.ReminderRepository;
import com.code2care.reminder.domain.service.ReminderDomainService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Slf4j
@Service
public class CreateReminderUseCase extends ReminderUseCase {

    protected CreateReminderUseCase(ReminderRepository reminderRepository, ReminderDomainService reminderDomainService) {
        super(reminderRepository,reminderDomainService);
    }

    public void execute(ReminderDto reminder) {
        try {
            this.reminderRepository.saveReminder(reminder);
        } catch (Exception e) {
            log.error(Arrays.toString(e.getStackTrace()));
        }

    }
}
