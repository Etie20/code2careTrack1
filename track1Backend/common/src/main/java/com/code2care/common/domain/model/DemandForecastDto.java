package com.code2care.common.domain.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.DemandForecast}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemandForecastDto implements Serializable {
    private Integer id;
    @NotNull
    private Instant forecastDate;
    @NotNull
    @Size(max = 5)
    private String bloodType;
    @NotNull
    @Size(max = 20)
    private String componentType;
    @NotNull
    private Integer forecastQuantity;
    @NotNull
    private LocalDate forecastStartDate;
    @NotNull
    private LocalDate forecastEndDate;
    private BigDecimal confidenceLevel;
    @Size(max = 50)
    private String modelVersion;
    @NotNull
    private DepartmentDto department;
}