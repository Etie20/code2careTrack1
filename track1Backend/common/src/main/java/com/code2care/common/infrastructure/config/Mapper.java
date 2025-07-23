package com.code2care.common.infrastructure.config;

import com.code2care.common.domain.model.*;
import com.code2care.common.infrastructure.entites.Doctor;
import com.code2care.common.infrastructure.entites.Feedback;
import com.code2care.common.infrastructure.entites.Patient;
import com.code2care.common.infrastructure.entites.Reminder;

import java.util.List;

public class Mapper {

    public static PatientDto mapPatientDto(Patient patient) {
        return PatientDto.builder()
                .id(patient.getId())
                .phoneNumber(patient.getPhoneNumber())
                .email(patient.getEmail())
                .fullName(patient.getFullName())
                .age(patient.getAge())
                .department(patient.getDepartment())
                .preferredLanguage(patient.getPreferredLanguage())
                .build();
    }

    public static Patient mapPatient(PatientDto dto) {
        return Patient.builder()
                .id(dto.getId())
                .phoneNumber(dto.getPhoneNumber())
                .email(dto.getEmail())
                .fullName(dto.getFullName())
                .department(dto.getDepartment())
                .age(dto.getAge())
                .preferredLanguage(dto.getPreferredLanguage())
                .build();
    }

    public static List<PatientDto> mapPatientDtos(List<Patient> patients) {
        return patients.stream()
                .map(Mapper::mapPatientDto)
                .toList();
    }

    public static List<Patient> mapPatients(List<PatientDto> dtos) {
        return dtos.stream()
                .map(Mapper::mapPatient)
                .toList();
    }

    public static DoctorDto mapDoctorDto(Doctor doctor) {
        return  DoctorDto.builder()
                .phoneNumber(doctor.getPhoneNumber())
                .email(doctor.getEmail())
                .password(doctor.getPassword())
                .specialty(doctor.getSpecialty())
                .fullName(doctor.getFullName())
                .id(doctor.getId())
                .build();
    }
    public  static Doctor mapDoctor(DoctorDto dto) {
        return Doctor.builder()
                .phoneNumber(dto.getPhoneNumber())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .specialty(dto.getSpecialty())
                .fullName(dto.getFullName())
                .build();
    }
    
    public static List<DoctorDto> mapDoctorDtos(List<Doctor> doctors) {
        return doctors.stream()
                .map(Mapper::mapDoctorDto)
                .toList();
    }
    
    public static List<Doctor> mapDoctors(List<DoctorDto> dtos) {
        return dtos.stream()
                .map(Mapper::mapDoctor)
                .toList();
    }

    public static FeedbackDto mapFeedbackDto(Feedback feedback) {
        return FeedbackDto.builder()
                .id(feedback.getId())
                .feedbackText(feedback.getFeedbackText())
                .language(feedback.getLanguage())
                .emojiRating(feedback.getEmojiRating())
                .patient(mapPatientDto(feedback.getPatient()))
                .starRating(feedback.getStarRating())
                .resolutionTimeMin(feedback.getResolutionTimeMin())
                .waitTimeMin(feedback.getWaitTimeMin())
                .submittedAt(feedback.getSubmittedAt())
                .build();
    }

    public static Feedback mapFeedback(FeedbackDto dto) {
        return Feedback.builder()
                .id(dto.getId())
                .feedbackText(dto.getFeedbackText())
                .language(dto.getLanguage())
                .emojiRating(dto.getEmojiRating())
                .patient(mapPatient(dto.getPatient()))
                .starRating(dto.getStarRating())
                .resolutionTimeMin(dto.getResolutionTimeMin())
                .waitTimeMin(dto.getWaitTimeMin())
                .submittedAt(dto.getSubmittedAt())
                .build();
    }

    public static List<FeedbackDto> mapFeedbackDtos(List<Feedback> feedbacks) {
        return feedbacks.stream()
                .map(Mapper::mapFeedbackDto)
                .toList();
    }

    public static List<Feedback> mapFeedbacks(List<FeedbackDto> dtos) {
        return dtos.stream()
                .map(Mapper::mapFeedback)
                .toList();
    }

    public static ReminderDto mapReminderDto(Reminder reminder) {
        return ReminderDto.builder()
                .id(reminder.getId())
                .message(reminder.getMessage())
                .patient(mapPatientDto(reminder.getPatient()))
                .language(reminder.getLanguage())
                .type(ReminderType.fromValue(reminder.getType()))
                .reminderDate(reminder.getReminderDate())
                .doctor(mapDoctorDto(reminder.getDoctor()))
                .channel(reminder.getChannel())
                .build();
    }

    public static Reminder mapReminder(ReminderDto dto) {
        return Reminder.builder()
                .id(dto.getId())
                .message(dto.getMessage())
                .language(dto.getLanguage())
                .type(dto.getType().getValue())
                .patient(mapPatient(dto.getPatient()))
                .reminderDate(dto.getReminderDate())
                .doctor(Doctor.builder().id(dto.getDoctor().getId()).build())
                .channel(dto.getChannel())
                .build();
    }

    public static List<ReminderDto> mapReminderDtos(List<Reminder> reminders) {
        return reminders.stream()
                .map(Mapper::mapReminderDto)
                .toList();
    }

    public static List<Reminder> mapReminders(List<ReminderDto> dtos) {
        return dtos.stream()
                .map(Mapper::mapReminder)
                .toList();
    }
}
