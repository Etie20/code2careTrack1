package com.code2care.reminder.application.service;

import com.code2care.common.domain.model.ReminderDto;
import com.code2care.reminder.domain.exeption.ReminderTypeNotExist;
import com.code2care.reminder.domain.repository.ReminderRepository;
import com.code2care.reminder.domain.service.ReminderDomainService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class GetRemindersByTypeReminderUseCase extends ReminderUseCase {
    protected GetRemindersByTypeReminderUseCase(ReminderRepository reminderRepository, ReminderDomainService reminderDomainService) {
        super(reminderRepository, reminderDomainService);
    }

    List<ReminderDto> execute(String type) {
        try {
            if (this.reminderDomainService.reminderTypeExists(type)) {
                return reminderRepository.findAllByType(type);
            } else {
                throw new Exception();
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ReminderTypeNotExist();
        }
    }
}
