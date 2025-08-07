package com.code2care.common.infrastructure.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction {
    @Id
    @ColumnDefault("nextval('inventory_transactions_transaction_id_seq')")
    @Column(name = "transaction_id", nullable = false)
    private Integer id;

    @jakarta.validation.constraints.Size(max = 20)
    @Column(name = "transaction_type", length = 20)
    private String transactionType;

    @jakarta.validation.constraints.NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "transaction_date", nullable = false)
    private Instant transactionDate;

    @jakarta.validation.constraints.Size(max = 50)
    @Column(name = "from_location", length = 50)
    private String fromLocation;

    @Column(name = "reason", length = Integer.MAX_VALUE)
    private String reason;

    @jakarta.validation.constraints.Size(max = 50)
    @Column(name = "performed_by", length = 50)
    private String performedBy;

}