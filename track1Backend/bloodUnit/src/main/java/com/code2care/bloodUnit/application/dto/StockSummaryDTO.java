package com.code2care.bloodUnit.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockSummaryDTO {
    private long totalUnits;
    private long criticalStocks;
    private long expiringSoonStocks;
    private long normalStocks;
}