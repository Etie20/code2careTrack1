package com.code2care.common.domain.model;

import lombok.Getter;

@Getter
public enum ReminderStatus {
    PENDING("PENDING"),
    DELIVERED("DELIVERED");

    private final String value;

    ReminderStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }
}