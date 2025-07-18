package com.code2care.reminder.domain.service;

import com.code2care.common.domain.model.ReminderType;
import com.code2care.reminder.domain.repository.ReminderRepository;
import org.springframework.stereotype.Service;

@Service
public class ReminderDomainService {
    private final ReminderRepository reminderRepository;

    public ReminderDomainService(ReminderRepository reminderRepository) {
        this.reminderRepository = reminderRepository;
    }

   public boolean reminderTypeExists(String reminderType) {
        try {
            ReminderType.valueOf(reminderType);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
