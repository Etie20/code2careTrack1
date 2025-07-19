package com.code2care.common.domain.model;

import lombok.Builder;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.Patient}
 */
@Value
@Builder
public class PatientDto implements Serializable {
    Integer id;
    String fullName;
    Integer age;
    String department;
    String phoneNumber;
    Instant createdAt;
    Language preferredLanguage;
    Email email;
}