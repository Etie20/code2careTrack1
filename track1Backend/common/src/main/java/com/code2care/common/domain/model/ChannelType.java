package com.code2care.common.domain.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum ChannelType {

    sms("sms"),
    mail("mail");
    private final String value;
    private ChannelType(String value) {
        this.value = value;
    }

    public static ChannelType fromValue(String value) {
        for (ChannelType c : ChannelType.values()) {
            if (c.getValue().equalsIgnoreCase(value)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Unknown ChannelType: " + value);
    }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static ChannelType fromJson(String value) {
        return fromValue(value);
    }

    @JsonValue
    public String toJson() {
        return value;
    }
    
}
