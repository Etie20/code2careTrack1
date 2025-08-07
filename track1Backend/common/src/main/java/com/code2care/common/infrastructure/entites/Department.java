package com.code2care.common.infrastructure.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "departments")
public class Department {
    @Id
    @ColumnDefault("nextval('departments_department_id_seq')")
    @Column(name = "department_id", nullable = false)
    private Integer id;

    @jakarta.validation.constraints.Size(max = 50)
    @jakarta.validation.constraints.NotNull
    @Column(name = "department_name", nullable = false, length = 50)
    private String departmentName;

    @jakarta.validation.constraints.Size(max = 50)
    @Column(name = "location", length = 50)
    private String location;

    @jakarta.validation.constraints.Size(max = 50)
    @Column(name = "contact_person", length = 50)
    private String contactPerson;

    @jakarta.validation.constraints.Size(max = 15)
    @Column(name = "contact_number", length = 15)
    private String contactNumber;

    @Column(name = "average_monthly_usage")
    private Integer averageMonthlyUsage;

}