package com.code2care.common.infrastructure.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@Entity
@Table(name = "donor_medical_history")
public class DonorMedicalHistory {
    @Id
    @ColumnDefault("nextval('donor_medical_history_history_id_seq')")
    @Column(name = "history_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id")
    private Donor donor;

    @jakarta.validation.constraints.NotNull
    @Column(name = "screening_date", nullable = false)
    private Instant screeningDate;

    @Column(name = "hemoglobin_level", precision = 5, scale = 2)
    private BigDecimal hemoglobinLevel;

    @Column(name = "weight_kg", precision = 5, scale = 2)
    private BigDecimal weightKg;

    @jakarta.validation.constraints.Size(max = 10)
    @Column(name = "blood_pressure", length = 10)
    private String bloodPressure;

    @Column(name = "temperature", precision = 4, scale = 2)
    private BigDecimal temperature;

    @Column(name = "infectious_disease_test")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> infectiousDiseaseTest;

    @jakarta.validation.constraints.Size(max = 20)
    @Column(name = "screening_status", length = 20)
    private String screeningStatus;

    @Column(name = "notes", length = Integer.MAX_VALUE)
    private String notes;

}