package com.code2care.common.domain.model;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class AlertDto {
    Integer id;
    String alertType;
    String severity;
    String bloodType;
    String componentType;
    String message;
    Instant triggeredOn;
    Boolean resolved;
    Instant resolvedOn;
    String resolvedBy;
}
