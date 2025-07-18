package com.code2care.common.infrastructure.entites;

import com.code2care.common.domain.model.Language;
import com.code2care.common.domain.model.ReminderType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@jakarta.persistence.Entity
@jakarta.persistence.Table(name = "reminder")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reminder {
    @jakarta.persistence.Id
    @org.hibernate.annotations.ColumnDefault("nextval('reminder_id_seq')")
    @jakarta.persistence.Column(name = "id", nullable = false)
    private Integer id;

    @jakarta.persistence.ManyToOne(fetch = jakarta.persistence.FetchType.LAZY, optional = false)
    @org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
    @jakarta.persistence.JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @jakarta.persistence.ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.SET_NULL)
    @jakarta.persistence.JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @jakarta.persistence.Column(name = "message", nullable = false, length = Integer.MAX_VALUE)
    private String message;
    @jakarta.persistence.Column(name = "reminder_date", nullable = false)
    private Instant reminderDate;

 @jakarta.persistence.Column(name = "type", columnDefinition = "reminder_type_enum not null")
   @Enumerated(EnumType.STRING)
    private ReminderType type;

/*
 TODO [Reverse Engineering] create field to map the 'channel' column
 Available actions: Define target Java type | Uncomment as is | Remove column mapping
    @org.hibernate.annotations.ColumnDefault("'sms'")
    @jakarta.persistence.Column(name = "channel", columnDefinition = "channel_enum not null")
    private Object channel;
*/
/*
 TODO [Reverse Engineering] create field to map the 'status' column
 Available actions: Define target Java type | Uncomment as is | Remove column mapping
    @org.hibernate.annotations.ColumnDefault("'active'")
    @jakarta.persistence.Column(name = "status", columnDefinition = "reminder_status_enum not null")
    private Object status;
*/
    @org.hibernate.annotations.ColumnDefault("'FR'")
    @jakarta.persistence.Column(name = "language", columnDefinition = "language_enum", nullable = false)
    @Enumerated(EnumType.STRING)
    private Language language;
}

