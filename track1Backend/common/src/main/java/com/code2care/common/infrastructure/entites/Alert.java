package com.code2care.common.infrastructure.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "alerts")
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ColumnDefault("nextval('alerts_alert_id_seq')")
    @Column(name = "alert_id", nullable = false)
    private Integer id;

    @jakarta.validation.constraints.Size(max = 30)
    @jakarta.validation.constraints.NotNull
    @Column(name = "alert_type", nullable = false, length = 30)
    private String alertType;

    @jakarta.validation.constraints.Size(max = 10)
    @Column(name = "severity", length = 10)
    private String severity;

    @jakarta.validation.constraints.Size(max = 5)
    @Column(name = "blood_type", length = 5)
    private String bloodType;

    @jakarta.validation.constraints.Size(max = 20)
    @Column(name = "component_type", length = 20)
    private String componentType;

    @jakarta.validation.constraints.NotNull
    @Column(name = "message", nullable = false, length = Integer.MAX_VALUE)
    private String message;

    @jakarta.validation.constraints.NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "triggered_on", nullable = false)
    private Instant triggeredOn;

    @ColumnDefault("false")
    @Column(name = "resolved")
    private Boolean resolved;

    @Column(name = "resolved_on")
    private Instant resolvedOn;

    @jakarta.validation.constraints.Size(max = 50)
    @Column(name = "resolved_by", length = 50)
    private String resolvedBy;

}