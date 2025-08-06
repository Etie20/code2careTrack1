package com.code2care.common.domain.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.InventoryTransaction}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryTransactionDto implements Serializable {
    private Integer id;
    @Size(max = 20)
    private String transactionType;
    @NotNull
    private Instant transactionDate;
    @Size(max = 50)
    private String fromLocation;
    private String reason;
    @Size(max = 50)
    private String performedBy;
}