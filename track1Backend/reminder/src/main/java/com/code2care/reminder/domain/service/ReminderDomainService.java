package com.code2care.reminder.domain.service;

import com.code2care.common.domain.model.ReminderType;
import com.code2care.reminder.domain.repository.ReminderRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Objects;

@Service
public class ReminderDomainService {
    private final ReminderRepository reminderRepository;

    public ReminderDomainService(ReminderRepository reminderRepository) {
        this.reminderRepository = reminderRepository;
    }

   public boolean reminderTypeExists(String reminderType) {
        try {
            for (ReminderType type : ReminderType.values()) {
                System.out.println(type.getValue());
                if (Objects.equals(type.getValue(), reminderType)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            System.out.println("Reminder Type " + reminderType + " not found"+ Arrays.toString(e.getStackTrace()));
            return false;
        }
    }
}
