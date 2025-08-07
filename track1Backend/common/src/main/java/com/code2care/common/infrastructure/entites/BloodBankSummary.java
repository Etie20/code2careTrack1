package com.code2care.common.infrastructure.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "blood_bank_summary")
public class BloodBankSummary {
    @Id
    @Column(name = "total_blood_volume")
    private Long totalBloodVolume;

    @Column(name = "low_stock_blood_types")
    private Long lowStockBloodTypes;

    @Column(name = "total_donors")
    private Long totalDonors;

    @Column(name = "todays_requests")
    private Long todaysRequests;

}