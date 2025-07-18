package com.code2care.reminder.domain.repository;

import com.code2care.common.domain.model.ReminderDto;

import java.util.List;

public interface ReminderRepository {
    List<ReminderDto> findAllByDoctorID(int doctorID);
    List<ReminderDto> findAllByDoctorIDAndType(int doctorID, String type);
    void saveReminder(ReminderDto reminder);
    void changeReminderStatus(int reminderID, String status);
    List<ReminderDto> findAll();
    List<ReminderDto> findAllByType(String type);
}
