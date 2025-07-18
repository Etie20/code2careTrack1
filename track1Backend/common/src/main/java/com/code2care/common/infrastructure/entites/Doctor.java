package com.code2care.common.infrastructure.entites;


import com.code2care.common.domain.model.Email;
import com.code2care.common.infrastructure.config.EmailConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;


@Getter
@Setter
@Table(name = "doctor")
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    @Id
    @ColumnDefault("nextval('doctor_id_seq')")
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "specialty", length = 100)
    private String specialty;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "password", nullable = false, length = Integer.MAX_VALUE)
    private String password;

    @Column(name = "email", columnDefinition = "email_domain", nullable = false)
    @Convert(converter = EmailConverter.class)
    private Email email;
}