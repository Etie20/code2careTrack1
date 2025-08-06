package com.code2care.common.infrastructure.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "personnels")
public class Personnel {
    @Id
    @ColumnDefault("nextval('personnels_personnel_id_seq')")
    @Column(name = "personnel_id", nullable = false)
    private Integer id;

    @jakarta.validation.constraints.Size(max = 50)
    @jakarta.validation.constraints.NotNull
    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @jakarta.validation.constraints.Size(max = 255)
    @jakarta.validation.constraints.NotNull
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @jakarta.validation.constraints.Size(max = 100)
    @jakarta.validation.constraints.NotNull
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @jakarta.validation.constraints.Size(max = 100)
    @jakarta.validation.constraints.NotNull
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @jakarta.validation.constraints.Size(max = 20)
    @Column(name = "role", length = 20)
    private String role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

}