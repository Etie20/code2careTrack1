package com.code2care.common.infrastructure.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "reminder_stats")
public class ReminderStat {

    @Column(name = "total_reminders")
    private Long totalReminders;

    @Column(name = "delivered_reminders")
    private Long deliveredReminders;

    @Column(name = "pending_reminders")
    private Long pendingReminders;

    @Id
    @Column(name = "doctor_id")
    private Integer doctorId;

}