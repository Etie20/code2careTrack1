package com.code2care.common.domain.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.Department}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentDto implements Serializable {
    private Integer id;
    @NotNull
    @Size(max = 50)
    private String departmentName;
    @Size(max = 50)
    private String location;
    @Size(max = 50)
    private String contactPerson;
    @Size(max = 15)
    private String contactNumber;
    private Integer averageMonthlyUsage;
}