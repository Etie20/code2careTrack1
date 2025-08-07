package com.code2care.common.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.BloodStat}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodStatDto implements Serializable {
    String bloodType;
    Long totalBloodVolume;
    Long totalVolumeNeeded;

}