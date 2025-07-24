package com.code2care.common.infrastructure.config;

import com.code2care.common.domain.model.ChannelType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ChannelTypeConverter implements AttributeConverter<ChannelType, String> {
    @Override
    public String convertToDatabaseColumn(ChannelType attribute) {
        return attribute != null ? attribute.getValue() : null;
    }

    @Override
    public ChannelType convertToEntityAttribute(String dbData) {
        for (ChannelType c : ChannelType.values()) {
            if (c.getValue().equalsIgnoreCase(dbData)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Unknown channel type: " + dbData);
    }
}
