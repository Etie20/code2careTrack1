package com.code2care.common.infrastructure.entites;

import com.code2care.common.domain.model.ChannelType;
import com.code2care.common.domain.model.Language;
import com.code2care.common.domain.model.ReminderType;
import com.code2care.common.infrastructure.config.ChannelTypeConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Getter
@Setter
@jakarta.persistence.Entity
@jakarta.persistence.Table(name = "reminder")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reminder {
    @Id
    @ColumnDefault("nextval('reminder_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY, optional = false)
    @OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @OnDelete(action = org.hibernate.annotations.OnDeleteAction.SET_NULL)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(name = "message", nullable = false, length = Integer.MAX_VALUE)
    private String message;
    @Column(name = "reminder_date", nullable = false)
    private LocalDateTime reminderDate;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private ReminderType type;


    @org.hibernate.annotations.ColumnDefault("'sms'")
    @jakarta.persistence.Column(name = "channel", columnDefinition = "channel_enum not null")
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private ChannelType channel;

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
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private Language language;
}


