package com.code2care.common.infrastructure.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "transaction_history")
public class TransactionHistory {
    @Id
    @ColumnDefault("nextval('transaction_history_history_id_seq')")
    @Column(name = "history_id", nullable = false)
    private Integer id;

    @Column(name = "volume_ml")
    private Integer volumeMl;

    @jakarta.validation.constraints.Size(max = 20)
    @Column(name = "component_type", length = 20)
    private String componentType;

    @jakarta.validation.constraints.Size(max = 5)
    @Column(name = "blood_type", length = 5)
    private String bloodType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personnel_id")
    private Personnel personnel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_transaction_id")
    private InventoryTransaction inventoryTransaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_unit_id")
    private BloodUnit bloodUnit;

}