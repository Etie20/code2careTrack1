package com.code2care.common.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.ReminderStat}
 */
@Value
@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
public class ReminderStatDto implements Serializable {
    Long totalReminders;
    Long deliveredReminders;
    Long pendingReminders;
    Integer doctorId;

}