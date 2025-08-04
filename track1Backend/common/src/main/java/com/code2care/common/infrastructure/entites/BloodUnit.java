package com.code2care.common.infrastructure.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "blood_units")
public class BloodUnit {
    @Id
    @jakarta.validation.constraints.Size(max = 20)
    @Column(name = "unit_id", nullable = false, length = 20)
    private String unitId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id")
    private Donor donor;

    @jakarta.validation.constraints.Size(max = 5)
    @jakarta.validation.constraints.NotNull
    @Column(name = "blood_type", nullable = false, length = 5)
    private String bloodType;

    @jakarta.validation.constraints.NotNull
    @Column(name = "collection_date", nullable = false)
    private Instant collectionDate;

    @jakarta.validation.constraints.NotNull
    @Column(name = "expiration_date", nullable = false)
    private Instant expirationDate;

    @Column(name = "volume_ml")
    private Integer volumeMl;

    @jakarta.validation.constraints.Size(max = 20)
    @Column(name = "component_type", length = 20)
    private String componentType;

    @jakarta.validation.constraints.Size(max = 50)
    @Column(name = "storage_location", length = 50)
    private String storageLocation;

    @jakarta.validation.constraints.Size(max = 20)
    @Column(name = "current_status", length = 20)
    private String currentStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screening_id")
    private DonorMedicalHistory screening;

    @jakarta.validation.constraints.Size(max = 50)
    @Column(name = "collection_center", length = 50)
    private String collectionCenter;

}