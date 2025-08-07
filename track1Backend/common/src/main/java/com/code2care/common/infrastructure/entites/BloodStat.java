package com.code2care.common.infrastructure.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "blood_stats")
public class BloodStat {
    @Size(max = 5)
    @Id
    @Column(name = "blood_type", length = 5)
    private String bloodType;

    @Column(name = "total_blood_volume")
    private Long totalBloodVolume;

    @Column(name = "total_volume_needed")
    private Long totalVolumeNeeded;

}