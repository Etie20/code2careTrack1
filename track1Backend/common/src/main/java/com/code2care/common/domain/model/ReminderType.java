package com.code2care.common.domain.model;

import lombok.Getter;

@Getter
public enum ReminderType{

    appointment("appointment"),
    medication("medication");
    
    private final String value;
    
    ReminderType(String value) {
        this.value = value;
    }
    
    // Add this method to convert from value to enum
    public static ReminderType fromValue(String value) {
        for (ReminderType type : ReminderType.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("No enum constant for value: " + value);
    }
}