package com.code2care.common.infrastructure.config;

import com.code2care.common.domain.model.Language;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class LanguageConverter implements AttributeConverter<Language, String> {

    @Override
    public String convertToDatabaseColumn(Language language) {
        if (language == null) {
            return null;
        }
        return language.getCode();
    }

    @Override
    public Language convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }

        try {
            return Language.valueOf(dbData.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unknown language value: " + dbData, e);
        }
    }
}