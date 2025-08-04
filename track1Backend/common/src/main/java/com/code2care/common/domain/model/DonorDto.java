package com.code2care.common.domain.model;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class DonorDto {
    Integer id;
    String fullName;
    String contactNumber;
    String bloodType;
    String gender;
    LocalDateTime dateOfBirth;
    String email;
    String address;
    String occupation;
    LocalDateTime registrationDate;
    LocalDateTime lastDonationDate;
    String medicalNotes;
}
