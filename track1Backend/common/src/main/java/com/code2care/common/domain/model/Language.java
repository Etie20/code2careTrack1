package com.code2care.common.domain.model;

import lombok.Getter;

@Getter
public enum Language {
    FRENCH("FRENCH"),
    ENGLISH("ENGLISH"),
    DLA("DLA"),
    BASSA("BASSA"),
    EWONDO("EWONDO");

    private final String code;

    Language(String code) {
        this.code = code;
    }
}
