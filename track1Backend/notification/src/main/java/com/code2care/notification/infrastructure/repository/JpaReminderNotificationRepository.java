package com.code2care.notification.infrastructure.repository;

import com.code2care.common.infrastructure.entites.Reminder;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListPagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaReminderNotificationRepository extends ListPagingAndSortingRepository<Reminder, Integer> {

    @Query("SELECT r FROM Reminder r JOIN FETCH r.patient WHERE FUNCTION('DATE_TRUNC', 'day', r.reminderDate) = FUNCTION('DATE_TRUNC', 'day', CURRENT_TIMESTAMP) AND FUNCTION('to_char', r.reminderDate, 'HH24:MI') = FUNCTION('to_char', CURRENT_TIMESTAMP, 'HH24:MI')")
    List<Reminder> findRemindersForCurrentDateAndTime();

}