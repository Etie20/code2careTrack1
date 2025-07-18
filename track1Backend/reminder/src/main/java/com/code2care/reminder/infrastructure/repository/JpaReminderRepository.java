package com.code2care.reminder.infrastructure.repository;

import com.code2care.common.infrastructure.entites.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JpaReminderRepository extends JpaRepository<Reminder, Integer>, JpaSpecificationExecutor<Reminder> {
}