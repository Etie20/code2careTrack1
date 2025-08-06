package com.code2care.reminder.application.service;

import com.code2care.common.domain.model.ReminderStatDto;
import com.code2care.reminder.domain.repository.ReminderRepository;
import com.code2care.reminder.domain.service.ReminderDomainService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ReminderStatUseCase extends ReminderUseCase {
    protected ReminderStatUseCase(ReminderRepository reminderRepository, ReminderDomainService reminderDomainService) {
        super(reminderRepository, reminderDomainService);
    }

    public  ReminderStatDto execute(Integer doctorId) {
        try{
            return  reminderRepository.getReminderStat(doctorId);
        } catch (RuntimeException e) {
            log.error(e.getMessage());
            throw new RuntimeException("Error getting reminder stat");
        }

    }
}
