package com.code2care.common.domain.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.BloodUnit}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodUnitDto implements Serializable {
    @Size(max = 20)
    private String unitId;
    @NotNull
    private DonorDto donor;
    @NotNull
    @Size(max = 5)
    private String bloodType;
    @NotNull
    private Instant collectionDate;
    @NotNull
    private Instant expirationDate;
    private Integer volumeMl;
    @Size(max = 20)
    private String componentType;
    @Size(max = 50)
    private String storageLocation;
    @Size(max = 20)
    private String currentStatus;
    @NotNull
    private DonorMedicalHistoryDto screening;
    @Size(max = 50)
    private String collectionCenter;
}