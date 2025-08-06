package com.code2care.reminder.domain.repository;

import com.code2care.common.domain.model.ReminderDto;
import com.code2care.common.domain.model.ReminderStatDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReminderRepository {
    List<ReminderDto> findAllByDoctorID(int doctorID, Pageable pageable);
    List<ReminderDto> findAllByDoctorIDAndType(int doctorID, String type,Pageable page );
    void saveReminder(ReminderDto reminder);
    void changeReminderStatus(int reminderID, String status);
    List<ReminderDto> findAll(Pageable page );
    List<ReminderDto> findAllByType(String type,Pageable page );
    ReminderStatDto getReminderStat(Integer doctorId);
}
