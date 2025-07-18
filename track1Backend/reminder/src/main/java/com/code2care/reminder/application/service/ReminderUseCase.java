package com.code2care.reminder.application.service;

import com.code2care.reminder.domain.repository.ReminderRepository;
import com.code2care.reminder.domain.service.ReminderDomainService;

public abstract class ReminderUseCase {

    protected ReminderRepository reminderRepository;
    protected ReminderDomainService reminderDomainService;
    protected ReminderUseCase(ReminderRepository reminderRepository, ReminderDomainService reminderDomainService) {
        this.reminderRepository = reminderRepository;
        this.reminderDomainService = reminderDomainService;
    }




}
