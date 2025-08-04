package com.code2care.common.infrastructure.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "donors")
public class Donor {
    @Id
    @ColumnDefault("nextval('donors_donor_id_seq')")
    @Column(name = "donor_id", nullable = false)
    private Integer id;

    @jakarta.validation.constraints.Size(max = 50)
    @jakarta.validation.constraints.NotNull
    @Column(name = "full_name", nullable = false, length = 50)
    private String fullName;

    @jakarta.validation.constraints.NotNull
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @jakarta.validation.constraints.Size(max = 10)
    @Column(name = "gender", length = 10)
    private String gender;

    @jakarta.validation.constraints.Size(max = 5)
    @Column(name = "blood_type", length = 5)
    private String bloodType;

    @jakarta.validation.constraints.Size(max = 15)
    @Column(name = "contact_number", length = 15)
    private String contactNumber;

    @jakarta.validation.constraints.Size(max = 100)
    @Column(name = "email", length = 100)
    private String email;

    @jakarta.validation.constraints.Size(max = 50)
    @Column(name = "occupation", length = 50)
    private String occupation;

    @Column(name = "address", length = Integer.MAX_VALUE)
    private String address;

    @jakarta.validation.constraints.NotNull
    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    @Column(name = "medical_notes", length = Integer.MAX_VALUE)
    private String medicalNotes;

}