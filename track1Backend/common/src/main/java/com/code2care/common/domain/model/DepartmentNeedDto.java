package com.code2care.common.domain.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.DepartmentNeed}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentNeedDto implements Serializable {
    private Integer id;
    @NotNull
    private DepartmentDto department;
    @NotNull
    private PersonnelDto personnel;
    @NotNull
    @Size(max = 5)
    private String bloodType;
    @NotNull
    @Size(max = 5)
    private String demandType;
    @NotNull
    @Size(max = 20)
    private String componentType;
    @NotNull
    @Size(max = 20)
    private String status;
    @NotNull
    @Size(max = 255)
    private String note;
    private Integer volumeNeeded;
    private Instant requestedDate;
    private Instant dueDate;
}