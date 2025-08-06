package com.code2care.donor.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {
    private long totalDonors;
    private long eligibleNow;
    private long totalDonations;
    private long donationsThisMonth;
}