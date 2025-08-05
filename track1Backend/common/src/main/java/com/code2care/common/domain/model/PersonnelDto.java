package com.code2care.common.domain.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.Personnel}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonnelDto implements Serializable {
    private Integer id;
    @NotNull
    @Size(max = 50)
    private String username;
    @NotNull
    @Size(max = 255)
    private String passwordHash;
    @NotNull
    @Size(max = 100)
    private String fullName;
    @NotNull
    @Size(max = 100)
    private String email;
    @Size(max = 20)
    private String role;
    @NotNull
    private DepartmentDto department;
}