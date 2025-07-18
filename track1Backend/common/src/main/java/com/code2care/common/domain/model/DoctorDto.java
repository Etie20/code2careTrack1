package com.code2care.common.domain.model;

import lombok.Builder;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.Doctor}
 */
@Value
@Builder
public class DoctorDto implements Serializable {
    Integer id;
    String fullName;
    String specialty;
    String phoneNumber;
    Instant createdAt;
    String password;
    Email email;
}