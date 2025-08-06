package com.code2care.reminder.infrastructure.repository;

import com.code2care.common.infrastructure.entites.ReminderStat;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface JpaReminderStatRepository extends Repository<ReminderStat, Long>, JpaSpecificationExecutor<ReminderStat> {

    @Query("select r from  ReminderStat r where  r.doctorId = :doctorId")
    ReminderStat findByDoctorId(Integer doctorId);
}