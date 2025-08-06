package com.code2care.common.domain.model;

import com.fasterxml.jackson.annotation.JsonValue;

public record Email(String value) {
    public Email {
        if (!value.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    @JsonValue
    public String value() {
        return value;
    }
}
