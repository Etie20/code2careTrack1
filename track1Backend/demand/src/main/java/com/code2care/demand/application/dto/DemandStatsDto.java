package com.code2care.demand.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemandStatsDto {
    private long totalRequests;
    private long pendingRequests;
    private long emergencyRequests;
    private long unitsRequested;
}
