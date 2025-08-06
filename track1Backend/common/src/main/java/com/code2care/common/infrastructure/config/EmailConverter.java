package com.code2care.common.infrastructure.config;

import com.code2care.common.domain.model.Email;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class EmailConverter implements AttributeConverter<Email, String> {
    @Override
    public String convertToDatabaseColumn(Email attribute) {
        return attribute != null ? attribute.value() : null;
    }

    @Override
    public Email convertToEntityAttribute(String dbData) {
        return dbData != null ? new Email(dbData) : null;
    }
}
