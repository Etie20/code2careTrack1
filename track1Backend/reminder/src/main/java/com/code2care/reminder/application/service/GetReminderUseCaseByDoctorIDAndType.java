package com.code2care.reminder.application.service;

import com.code2care.common.domain.model.ReminderDto;
import com.code2care.reminder.domain.exeption.ReminderTypeNotExist;
import com.code2care.reminder.domain.repository.ReminderRepository;
import com.code2care.reminder.domain.service.ReminderDomainService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class GetReminderUseCaseByDoctorIDAndType extends ReminderUseCase{
    protected GetReminderUseCaseByDoctorIDAndType(ReminderRepository reminderRepository, ReminderDomainService reminderDomainService) {
        super(reminderRepository, reminderDomainService);
    }

    List<ReminderDto> execute(int doctorID, String type, Pageable page ) {
        try{
            if(reminderDomainService.reminderTypeExists(type)){
              return reminderRepository.findAllByDoctorIDAndType(doctorID,type,page);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            throw  new ReminderTypeNotExist();
        }
    }
}
