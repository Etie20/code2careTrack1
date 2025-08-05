package com.code2care.common.domain.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.TransactionHistory}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionHistoryDto implements Serializable {
    private Integer id;
    private Integer volumeMl;
    @Size(max = 20)
    private String componentType;
    @Size(max = 5)
    private String bloodType;
    @NotNull
    private PersonnelDto personnel;
    @NotNull
    private InventoryTransactionDto inventoryTransaction;
    @NotNull
    private DepartmentDto department;
    @NotNull
    private BloodUnitDto bloodUnit;
}