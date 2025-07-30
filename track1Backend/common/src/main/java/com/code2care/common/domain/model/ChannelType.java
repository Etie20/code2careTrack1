package com.code2care.common.domain.model;

import lombok.Getter;

@Getter
public enum ChannelType {

    SMS("sms"),
    MAIL("mail");
    private final String value;
    private ChannelType(String value) {
        this.value = value;
    }

    public ChannelType fromValue(String value) {
        for (ChannelType c : ChannelType.values()) {
            if (c.getValue().equals(value)) {
                return c;
            }
        }
        return null;
    }
    
}
