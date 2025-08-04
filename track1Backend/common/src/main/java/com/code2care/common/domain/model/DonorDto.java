package com.code2care.common.domain.model;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DonorDto {
    private Integer id;
    private String fullName;
    private String contactNumber;
    private String bloodType;
    private String gender;
    private LocalDate dateOfBirth;
    private String email;
    private String address;
    private String occupation;
    private LocalDate registrationDate;
    private LocalDate lastDonationDate;
    private String medicalNotes;
}
