package com.code2care.common.infrastructure.entites;

import com.code2care.common.domain.model.ReminderType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.sql.SQLException;

@Converter(autoApply = true)
public class ReminderTypeConverter implements AttributeConverter<ReminderType, String> {

    @Override
    public String convertToDatabaseColumn(ReminderType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public ReminderType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        return ReminderType.fromValue(dbData);
    }
}