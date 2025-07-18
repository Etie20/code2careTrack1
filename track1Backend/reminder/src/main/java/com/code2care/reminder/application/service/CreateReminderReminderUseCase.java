package com.code2care.reminder.application.service;

import com.code2care.common.domain.model.ReminderDto;
import com.code2care.reminder.domain.repository.ReminderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Slf4j
@Service
public class CreateReminderReminderUseCase extends ReminderUseCase {

    protected CreateReminderReminderUseCase(ReminderRepository reminderRepository) {
        super(reminderRepository);
    }

    void execute(ReminderDto reminder) {
        try {
            this.reminderRepository.saveReminder(reminder);
        } catch (Exception e) {
            log.error(Arrays.toString(e.getStackTrace()));
        }

    }
}
