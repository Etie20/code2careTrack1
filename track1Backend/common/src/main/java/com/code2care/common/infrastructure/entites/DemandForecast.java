package com.code2care.common.infrastructure.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "demand_forecasts")
public class DemandForecast {
    @Id
    @ColumnDefault("nextval('demand_forecasts_forecast_id_seq')")
    @Column(name = "forecast_id", nullable = false)
    private Integer id;

    @jakarta.validation.constraints.NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "forecast_date", nullable = false)
    private Instant forecastDate;

    @jakarta.validation.constraints.Size(max = 5)
    @jakarta.validation.constraints.NotNull
    @Column(name = "blood_type", nullable = false, length = 5)
    private String bloodType;

    @jakarta.validation.constraints.Size(max = 20)
    @jakarta.validation.constraints.NotNull
    @Column(name = "component_type", nullable = false, length = 20)
    private String componentType;

    @jakarta.validation.constraints.NotNull
    @Column(name = "forecast_quantity", nullable = false)
    private Integer forecastQuantity;

    @jakarta.validation.constraints.NotNull
    @Column(name = "forecast_start_date", nullable = false)
    private LocalDate forecastStartDate;

    @jakarta.validation.constraints.NotNull
    @Column(name = "forecast_end_date", nullable = false)
    private LocalDate forecastEndDate;

    @Column(name = "confidence_level", precision = 3, scale = 2)
    private BigDecimal confidenceLevel;

    @jakarta.validation.constraints.Size(max = 50)
    @Column(name = "model_version", length = 50)
    private String modelVersion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

}