package com.code2care.common.infrastructure.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "department_needs")
public class DepartmentNeed {
    @Id
    @ColumnDefault("nextval('department_needs_need_id_seq')")
    @Column(name = "need_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personnel_id")
    private Personnel personnel;

    @jakarta.validation.constraints.Size(max = 5)
    @jakarta.validation.constraints.NotNull
    @Column(name = "blood_type", nullable = false, length = 5)
    private String bloodType;

    @jakarta.validation.constraints.Size(max = 255)
    @jakarta.validation.constraints.NotNull
    @Column(name = "demand_type", nullable = false, length = 5)
    private String demandType;

    @jakarta.validation.constraints.Size(max = 20)
    @jakarta.validation.constraints.NotNull
    @Column(name = "component_type", nullable = false, length = 20)
    private String componentType;

    @jakarta.validation.constraints.Size(max = 20)
    @jakarta.validation.constraints.NotNull
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @jakarta.validation.constraints.Size(max = 255)
    @jakarta.validation.constraints.NotNull
    @Column(name = "note", nullable = false)
    private String note;

    @Column(name = "volume_needed")
    private Integer volumeNeeded;

    @Column(name = "requested_date")
    private Instant requestedDate;

    @Column(name = "due_date")
    private Instant dueDate;

}