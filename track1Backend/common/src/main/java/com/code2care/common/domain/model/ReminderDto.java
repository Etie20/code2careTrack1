package com.code2care.common.domain.model;

import lombok.Builder;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.Reminder}
 */
@Value
@Builder
public class ReminderDto implements Serializable {
    Integer id;
    PatientDto patient;
    DoctorDto doctor;
    String message;
    LocalDateTime reminderDate;
    ReminderType type;
    Language language;
    ChannelType channel;
}