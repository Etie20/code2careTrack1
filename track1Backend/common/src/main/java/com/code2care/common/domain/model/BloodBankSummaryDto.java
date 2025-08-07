package com.code2care.common.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.BloodBankSummary}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodBankSummaryDto implements Serializable {
    Long totalBloodVolume;
    Long lowStockBloodTypes;
    Long totalDonors;
    Long todaysRequests;
}