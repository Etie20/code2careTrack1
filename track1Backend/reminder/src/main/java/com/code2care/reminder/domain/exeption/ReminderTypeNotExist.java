package com.code2care.reminder.domain.exeption;

public class ReminderTypeNotExist extends RuntimeException {
    public ReminderTypeNotExist() {
        super("Reminder not exist");
    }
}
