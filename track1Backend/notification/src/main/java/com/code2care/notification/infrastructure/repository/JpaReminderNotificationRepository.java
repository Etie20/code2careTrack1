package com.code2care.notification.infrastructure.repository;

import com.code2care.common.infrastructure.entites.Reminder;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListPagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JpaReminderNotificationRepository extends ListPagingAndSortingRepository<Reminder, Integer> {

    @Query("SELECT r FROM Reminder r " +
            "JOIN FETCH r.patient " +
            "WHERE DATE(r.reminderDate) = :date " +
            "AND FUNCTION('to_char', r.reminderDate, 'HH24:MI') = :hourMinute")
    List<Reminder> findRemindersByDateAndTime(
            @Param("date") LocalDate date,
            @Param("hourMinute") String hourMinute);
}