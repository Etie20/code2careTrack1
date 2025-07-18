package com.code2care.common.domain.model;

import lombok.Getter;

@Getter
public enum ReminderType{

    APP("appointment"),
    MED("medication");
    private final String value;
     ReminderType(String value) {
        this.value = value;
    }
}
