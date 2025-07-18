package com.code2care.reminder.infrastructure.repository;

import com.code2care.common.domain.model.ReminderType;
import com.code2care.common.infrastructure.entites.Reminder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.ListPagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaReminderRepository extends ListPagingAndSortingRepository<Reminder, Integer> {
    Page<Reminder> findAllByDoctor_Id(Integer doctorId,
                                      Pageable pageable);

    Page<Reminder> findAllByDoctor_IdAndType(Integer doctorId, ReminderType type,
                                             Pageable pageable);
}