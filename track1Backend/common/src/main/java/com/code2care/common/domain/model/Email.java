package com.code2care.common.domain.model;

public record Email(String value) {
    public Email {
        if (!value.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    @Override
    public String toString() {
        return value;
    }
}
