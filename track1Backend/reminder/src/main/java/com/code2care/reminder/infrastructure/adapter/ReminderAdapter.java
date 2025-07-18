package com.code2care.reminder.infrastructure.adapter;

import com.code2care.common.domain.model.ReminderDto;
import com.code2care.common.domain.model.ReminderType;
import com.code2care.common.infrastructure.config.Mapper;
import com.code2care.reminder.domain.repository.ReminderRepository;
import com.code2care.reminder.infrastructure.repository.JpaReminderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
class ReminderAdapter implements ReminderRepository {
    private final JpaReminderRepository jpaReminderRepository;

    ReminderAdapter(JpaReminderRepository jpaReminderRepository) {
        this.jpaReminderRepository = jpaReminderRepository;
    }

    @Override
    public List<ReminderDto> findAllByDoctorID(int doctorID, Pageable page ) {
        try{
           return Mapper.mapReminderDtos(this.jpaReminderRepository.findAllByDoctor_Id(doctorID,page).stream().toList());
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<ReminderDto> findAllByDoctorIDAndType(int doctorID, String type,Pageable page ) {

        try{
           return Mapper.mapReminderDtos(jpaReminderRepository.findAllByDoctor_IdAndType(doctorID, ReminderType.valueOf(type),page).stream().toList());
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }

    }

    @Override
    public void saveReminder(ReminderDto reminder) {

    }

    @Override
    public void changeReminderStatus(int reminderID, String status) {

    }

    @Override
    public List<ReminderDto> findAll(Pageable page) {
        return List.of();
    }

    @Override
    public List<ReminderDto> findAllByType(String type,Pageable page ) {
        return List.of();
    }
}
