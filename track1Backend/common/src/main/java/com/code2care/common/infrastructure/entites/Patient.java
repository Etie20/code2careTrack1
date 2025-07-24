package com.code2care.common.infrastructure.entites;

import com.code2care.common.domain.model.Email;
import com.code2care.common.domain.model.Language;
import com.code2care.common.infrastructure.config.EmailConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Table(name = "patient")
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    @org.hibernate.annotations.ColumnDefault("nextval('patient_id_seq')")
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "department", nullable = false, length = 100)
    private String department;

    @Column(name = "phone_number", nullable = false, length = 20,unique = true)
    private String phoneNumber;

    @org.hibernate.annotations.ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

 @org.hibernate.annotations.ColumnDefault("'FR'")
 @Column(name = "preferred_language", columnDefinition = "language_enum",nullable = false)
 @Enumerated(EnumType.STRING)
 private Language preferredLanguage;

 @Column(name = "email", columnDefinition = "email_domain", nullable = false)
 @Convert(converter = EmailConverter.class)
 private Email email;
}