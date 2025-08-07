package com.code2care.common.domain.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.DonorMedicalHistory}
 */
@Value
public class DonorMedicalHistoryDto implements Serializable {
    Integer id;
    @NotNull
    DonorDto donor;
    @NotNull
    Instant screeningDate;
    BigDecimal hemoglobinLevel;
    BigDecimal weightKg;
    @Size(max = 10)
    String bloodPressure;
    BigDecimal temperature;
    Map<String, Object> infectiousDiseaseTest;
    @Size(max = 20)
    String screeningStatus;
    String notes;
}